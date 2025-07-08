
function ConstructionBanner() {
  return (
    <>
      <h6 className="mg-construction-red">
        <span style={{ position: "relative", top: -4 }}>
          <i className="bi bi-wrench" style={{ position: 'relative', top: 4 }}></i>
          &nbsp;
          <span className="d-none d-sm-inline-block">(This page is Under Construction)</span>
          <span className="d-inline-block d-sm-none">(Page Under Construction)</span>
          &nbsp;
          &nbsp;
        </span>
      </h6>
    </>
  );
}
export default ConstructionBanner;