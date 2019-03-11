import * as React from "react";
import { Tabs, Tab } from "./components";
import { TabKey } from ".";

interface Props {
  activeTab: TabKey;
  setActiveTab: React.Dispatch<TabKey>;
}
export default function InspectorTabs(props: Props) {
  return (
    <Tabs>
      <Tab
        onClick={() => props.setActiveTab(TabKey.Inspector)}
        active={props.activeTab === TabKey.Inspector}
      >
        Inspector
      </Tab>
      <Tab
        onClick={() => props.setActiveTab(TabKey.Layers)}
        active={props.activeTab === TabKey.Layers}
      >
        Layers
      </Tab>
    </Tabs>
  );
}
