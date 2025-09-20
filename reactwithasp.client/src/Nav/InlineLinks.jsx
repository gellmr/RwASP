import VL from "@/Nav/Links/VL";

import '@/Nav/InlineLinks.css'

function InlineLinks({ linkA, linkB, linkC, linkD })
{
  const links = function ()
  {
    return <>
      <div className="inlineLink linkA">                {linkA}<VL /></div>
      <div className="inlineLink linkB">                {linkB}      </div>
      <div className="inlineLink linkC">          <VL />{linkC}      </div>
      {linkD && <div className="inlineLink linkD"><VL />{linkD}      </div>}
    </>;
  }

  return (
    <div className="d-inline-block d-sm-none inlineLinks">
      {links()}
    </div>
  );
}
export default InlineLinks;