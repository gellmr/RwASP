import VL from "@/Nav/Links/VL";

import '@/Nav/StackedLinks.css'

function StackedLinks({ linkA, linkB, linkC, linkD })
{
  const links = function () {
    return <>
      <div className="stackedLink linkA">                {linkA}<VL /></div>
      <div className="stackedLink linkB">                {linkB}      </div>
      <div className="stackedLink linkC">          <VL />{linkC}      </div>
      {linkD && <div className="stackedLink linkD"><VL />{linkD}      </div>}
    </>;
  }

  return (
    <div className="d-block stackedLinks">
      {links()}
    </div>
  );
}
export default StackedLinks;