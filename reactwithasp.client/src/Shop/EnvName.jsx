import React, { useState } from 'react';
import { useEffect } from 'react';

function EnvName()
{
  const [env, setEnv] = useState("None");

  useEffect(() => {
    fetchDebug();
  }, []);

  async function fetchDebug() {
    try {
      const response = await fetch(window.location.origin + "/api/envname");
      const data = await response.json();
      setEnv(data.env);
    } catch (err) {
    }
  }

  return (
    <>
      <span style={{ color: 'darkseagreen', fontSize:11 }}>Environment : {env}</span>
    </>
  );
}
export default EnvName;