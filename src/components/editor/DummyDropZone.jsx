import { useSortable } from "@dnd-kit/sortable";

const DummyDropZone = ({ item }) => {
    const { setNodeRef } = useSortable({ id: item.id });
    return <div ref={setNodeRef} className="dummy-drop-zone" id={item.id} />;
};

export default DummyDropZone;
