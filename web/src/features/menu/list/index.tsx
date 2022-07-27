import { Box, Stack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useNuiEvent } from "../../../hooks/useNuiEvent";
import { debugData } from "../../../utils/debugData";
import ListItem from "./ListItem";
import Header from "./Header";

interface MenuSettings {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  title: string;
  items: Array<{ label: string; value: string | string[] }>;
}

debugData<MenuSettings>([
  {
    action: "setMenu",
    data: {
      //   position: "bottom-left",
      title: "Vehicle garage",
      items: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Vehicle class", value: ["Nice", "Super nice", "Extra nice"] },
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Vehicle class", value: ["Nice", "Super nice", "Extra nice"] },
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Vehicle class", value: ["Nice", "Super nice", "Extra nice"] },
      ],
    },
  },
]);

const ListMenu: React.FC = () => {
  const [menu, setMenu] = useState<MenuSettings>({
    position: "top-left",
    title: "",
    items: [],
  });
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);
  const listRefs = useRef<Array<HTMLDivElement | null>>([]);

  const moveMenu = (e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowDown":
        setSelected((selected) => {
          if (selected >= menu.items.length - 1) return selected;
          return selected + 1;
        });
        break;
      case "ArrowUp":
        setSelected((selected) => {
          if (selected <= 0) return selected;
          return selected - 1;
        });
        break;
    }
  };

  useEffect(() => {
    listRefs.current[selected]?.focus();
  }, [selected]);

  useEffect(() => {
    if (!visible) return document.removeEventListener("keyup", moveMenu);

    document.addEventListener("keyup", moveMenu);
  }, [visible]);

  useNuiEvent("setMenu", (data: MenuSettings) => {
    if (!data.position) data.position = "top-left";
    setMenu(data);
    setVisible(true);
  });

  return (
    <>
      <Box
        width="sm"
        height="fit-content"
        maxHeight={480}
        overflow="hidden"
        borderRadius="md"
        bg="#141517"
        position="absolute"
        fontFamily="Nunito"
        mt={menu.position === "top-left" || menu.position === "top-right" ? 5 : 0}
        ml={menu.position === "top-left" || menu.position === "bottom-left" ? 5 : 0}
        mr={menu.position === "top-right" || menu.position === "bottom-right" ? 5 : 0}
        mb={menu.position === "bottom-left" || menu.position === "bottom-right" ? 5 : 0}
        right={menu.position === "top-right" ? 1 : undefined}
        left={menu.position === "bottom-left" ? 1 : undefined}
        bottom={menu.position === "bottom-left" || menu.position === "bottom-right" ? 1 : undefined}
      >
        <Header title={menu.title} />
        <Stack direction="column" p={2} overflowY="scroll">
          {menu.items.map((item, index) => (
            <ListItem index={index} item={item} ref={listRefs} key={`menu-item-${index}`} />
          ))}
        </Stack>
      </Box>
    </>
  );
};

export default ListMenu;
