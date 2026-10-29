import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { axiosInstance } from '@/axiosDefault.jsx';
import AdminTitleBar from "@/Admin/AdminTitleBar";

Chart.register(...registerables);

const AdminBi = () =>
{
  // Canvas references
  const revenueBarRef = useRef(null);
  const revenuePieRef = useRef(null);
  const quantityBarRef = useRef(null);
  const quantityPieRef = useRef(null);

  const xMonths = 6;

  // Keep track of active chart instances to destroy/recreate them on re-renders
  const chartsRef = useRef([]);

  useEffect(() => {
    let isMounted = true;
    axiosInstance.get(`/api/admin-sales-bi?months=${xMonths}`)
      .then(response => {
        if (!isMounted) return;
        const data = response.data;

        const labels = data.map(item => item.productTitle);
        const revenues = data.map(item => item.totalRevenue);
        const quantities = data.map(item => item.quantitySold);

        // Clear any old chart instances before creating new ones
        chartsRef.current.forEach(chart => chart.destroy());
        chartsRef.current = [];

        // Render charts
        renderRevenueBar(labels, revenues);
        renderRevenuePie(labels, revenues);
        renderQuantityBar(labels, quantities);
        renderQuantityPie(labels, quantities);
      })
      .catch(error => {
        console.error("Error fetching sales BI data:", error);
      });

    // Cleanup on unmount
    return () => {
      isMounted = false;
      chartsRef.current.forEach(chart => chart.destroy());
    };
  }, []);

  const renderRevenueBar = (labels, data) => {
    const ctx = revenueBarRef.current?.getContext('2d');
    if (ctx) {
      chartsRef.current.push(new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{ label: 'Revenue ($)', data, backgroundColor: '#36a2eb' }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: 'white' } }, y: { ticks: { color: 'white' } } } }
      }));
    }
  };

  const renderRevenuePie = (labels, data) => {
    const ctx = revenuePieRef.current?.getContext('2d');
    if (ctx) {
      chartsRef.current.push(new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{ data, backgroundColor: ['#36a2eb', '#ff6384', '#cc65fe', '#ffce56', '#4bc0c0', '#9966ff'] }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: 'white', boxWidth: 12 } } } }
      }));
    }
  };

  const renderQuantityBar = (labels, data) => {
    const ctx = quantityBarRef.current?.getContext('2d');
    if (ctx) {
      chartsRef.current.push(new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{ label: 'Quantity', data, backgroundColor: '#4bc0c0' }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: 'white' } }, y: { ticks: { color: 'white' } } } }
      }));
    }
  };

  const renderQuantityPie = (labels, data) => {
    const ctx = quantityPieRef.current?.getContext('2d');
    if (ctx) {
      chartsRef.current.push(new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{ data, backgroundColor: ['#4bc0c0', '#36a2eb', '#ff6384', '#ffce56', '#cc65fe', '#9966ff'] }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: 'white', boxWidth: 12 } } } }
      }));
    }
  };

  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="row">
          <div className="col-12" style={{marginTop:10}}><AdminTitleBar titleText="Product Sales" construction={false} /></div>
          <div className="col-12">
            <div className="row g-3">
              
              <div className="col-12 col-xl-8">
                <div className="card p-3 bg-dark shadow text-white">
                  <h5 className="card-title">Total Revenue (Past {xMonths} months)</h5>
                  <canvas ref={revenueBarRef}></canvas>
                </div>
              </div>

              <div className="col-12 col-xl-4">
                <div className="card p-3 bg-dark shadow text-white">
                  <h5 className="card-title">Revenue Share</h5>
                  <canvas ref={revenuePieRef}></canvas>
                </div>
              </div>

              <div className="col-12 col-xl-8">
                <div className="card p-3 bg-dark shadow text-white">
                  <h5 className="card-title">Quantity Sold (Past {xMonths} months)</h5>
                  <canvas ref={quantityBarRef}></canvas>
                </div>
              </div>

              <div className="col-12 col-xl-4">
                <div className="card p-3 bg-dark shadow text-white">
                  <h5 className="card-title">Quantity Share</h5>
                  <canvas ref={quantityPieRef}></canvas>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminBi;