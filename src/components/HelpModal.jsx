import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import Modal from "@/components/Modal";

const HelpModal = ({ isOpen = false, onClose }) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            closeButton={true}
            style={{ maxWidth: 400 }}
        >
            <div
                style={{
                    display: "grid",
                    gap: "1rem",
                }}
            >
                <h3>Keyboard Shortcuts</h3>
                <TableContainer component={"div"}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Action</TableCell>
                                <TableCell>Key</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    Expand / collapse event timer
                                </TableCell>
                                <TableCell>
                                    <code>F</code>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    Show / hide completed events
                                </TableCell>
                                <TableCell>
                                    <code>H</code>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    Cycle event highlight scheme
                                </TableCell>
                                <TableCell>
                                    <code>S</code>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Show this help window</TableCell>
                                <TableCell>
                                    <code>?</code>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Modal>
    );
};

export default HelpModal;
