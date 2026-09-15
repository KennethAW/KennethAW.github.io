import { useEffect } from "react";
import Site from "./Site";
import { startBehaviour } from "./behaviour";

export default function App() {
  useEffect(() => startBehaviour(), []);
  return <Site />;
}
