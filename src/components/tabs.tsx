import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsProps {
  children: React.ReactNode;
}

const TabsComponent = ({ children }: TabsProps) => {
  return (
    <Tabs defaultValue="tab1">
      <TabsList className="w-full">
        <TabsTrigger value="tab1">Working Hours</TabsTrigger>
        <TabsTrigger value="tab2">Constraints</TabsTrigger>
        <TabsTrigger value="tab3">Preferences</TabsTrigger>
      </TabsList>

      {children}
    </Tabs>
  );
};

export default TabsComponent;
