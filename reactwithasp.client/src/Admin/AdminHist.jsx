
import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { axiosInstance } from '@/axiosDefault.jsx';
import AdminTitleBar from "@/Admin/AdminTitleBar";

Chart.register(...registerables);

const AdminHist = () =>
{
  const historicalChartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() =>
  {
    let isMounted = true;
    axiosInstance.get('/api/admin-hist-sales').then(response =>
    {
      if (!isMounted) return;
      const data = response.data;
      const labels = data.map(item => item.date);
      const values = data.map(item => item.totalSales);
      const ctx = historicalChartRef.current?.getContext('2d');
      if (ctx)
      {
        if (chartInstanceRef.current) {
          // Destroy any existing chart instance before creating a new one
          chartInstanceRef.current.destroy();
        }
        chartInstanceRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Historical Sales',
              data: values,
              borderColor: '#36a2eb',
              backgroundColor: 'rgba(54, 162, 235, 0.3)',
              fill: true,
              tension: 0.1,
              pointRadius: 0
            }]
          },
          options: {
            responsive: true, plugins: { legend: { display: false }},
            scales: {
              x: { 
                ticks: { color: 'white', maxTicksLimit: 8 }, 
                grid: { color: 'rgba(255,255,255,0.05)' } 
              },
              y: { 
                ticks: { color: 'white' }, 
                grid: { color: 'rgba(255,255,255,0.1)' } 
              }
            }
          }
        });
      }
    })
    .catch(error => {
      console.error("Error fetching historical sales data:", error);
    });

    // Cleanup on unmount
    return () => {
      isMounted = false;
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="row">
      <div className="col-sm-12 adminCont adminParallax">
        <div className="row">
          <div className="col-12">
            <AdminTitleBar titleText="Historical Sales" construction={false} />
          </div>
          <div className="col-12">
            <div className="card p-3 bg-dark shadow text-white">
              <h5 className="card-title">Sales History</h5>
              <canvas ref={historicalChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminHist;
