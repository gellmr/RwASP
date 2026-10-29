import VL from "@/Nav/Links/VL";
import { useSelector } from 'react-redux';

import '@/Nav/InlineLinks.css'

function InlineLinks({ linkA, linkB, linkC, linkD, linkE, linkF })
{
  const isSyncing = useSelector(state => state.cart.isSyncing);

  const links = function ()
  {
    return <>
      <div className="inlineLink linkA">                {linkA}<VL /></div>
      <div className={`inlineLink linkB ${isSyncing ? 'inflight' : ''}`}> {linkB} </div>
      <div className="inlineLink linkC">          <VL />{linkC}      </div>
      {linkD && <div className="inlineLink linkD"><VL />{linkD}      </div>}
      {linkE && <div className="inlineLink linkE"><VL />{linkE}      </div>}
      {linkF && <div className="inlineLink linkF"><VL />{linkF}      </div>}
    </>;
  }

  return (
    <div className="inlineLinks">{links()}</div>
  );
}
export default InlineLinks;