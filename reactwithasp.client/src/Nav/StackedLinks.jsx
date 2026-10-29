import VL from "@/Nav/Links/VL";
import { useSelector } from 'react-redux';

import '@/Nav/StackedLinks.css'

function StackedLinks({ linkA, linkB, linkC, linkD, linkE, linkF })
{
  const isSyncing = useSelector(state => state.cart.isSyncing);

  const links = function () {
    return <>
      <div className="stackedLink linkA">                {linkA}<VL /></div>
      <div className={`stackedLink linkB ${isSyncing ? 'inflight' : ''}`}> {linkB} </div>
      <div className="stackedLink linkC">          <VL />{linkC}      </div>
      {linkD && <div className="stackedLink linkD"><VL />{linkD}      </div>}
      {linkE && <div className="stackedLink linkE"><VL />{linkE}      </div>}
      {linkF && <div className="stackedLink linkF"><VL />{linkF}      </div>}
    </>;
  }

  return (
    <div className="stackedLinks">
      {links()}
    </div>
  );
}
export default StackedLinks;