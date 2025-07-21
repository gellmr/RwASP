import ConstructionBanner from "@/main/ConstructionBanner.jsx";

const AdminTitleBar = ({ children, titleText="Title Here", construction=true}) => {
  return (
    <>
      <div style={{ textAlign: "center", paddingLeft: 15, paddingBottom: 5 }}>
        <h4 style={{ display: "inline-block", marginRight: 10 }}>{titleText}</h4>
        {children}
      </div>
      {construction && <ConstructionBanner />}
    </>
  );
}
export default AdminTitleBar;