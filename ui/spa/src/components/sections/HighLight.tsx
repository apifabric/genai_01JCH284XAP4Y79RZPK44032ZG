import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useDataProvider } from 'react-admin';

const ResourceList = () => {
    const [open, setOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [resourceData, setResourceData] = useState([]);
    const dataProvider = useDataProvider();

    const resources = ['Booking', 'Employee', 'Guest', 'Hotel', 'HotelService', 'Incident', 'MaintenanceRequest', 'Payment', 'Room', 'RoomStatus', 'RoomType', 'Service'];

    useEffect(() => {
        if (selectedResource) {
            dataProvider.getList(selectedResource, {
                pagination: { page: 1, perPage: 10 },
                meta: { include: ['+all'] },
            }).then(({ data }) => {
                setResourceData(data);
            });
        }
    }, [selectedResource, dataProvider]);

    const handleCardClick = (resource) => {
        setSelectedResource(resource);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedResource(null);
        setResourceData([]);
    };

    const renderResourceDetails = (item) => (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
                <TableBody>
                    {Object.entries(item).map(([key, value]) => (
                        typeof value !== 'object' &&
                        key !== 'id' &&
                        key !== 'ja_type' &&
                        key !== 'attributes' &&
                        key !== 'relationships' &&
                        key !== 'meta' && (
                            <TableRow key={key}>
                                <TableCell component="th" scope="row">
                                    <strong>{key}</strong>
                                </TableCell>
                                <TableCell>{value}</TableCell>
                            </TableRow>
                        )
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    const renderRelatedResources = (item) => (
        item.relationships &&
        Object.entries(item.relationships).map(([relKey, relValue]) => (
            relValue.data && (
                <Box key={relKey} mt={2}>
                    <Typography variant="h6" color="textSecondary">Related: {relKey}</Typography>
                    {Array.isArray(relValue.data) ?
                        relValue.data.map((relItem, index) => (
                            <Box key={`${relKey}-${index}`}>
                                <Typography variant="body2" color="primary">
                                    {relItem.type}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    (ID: {relItem.id})
                                </Typography>
                            </Box>
                        )) :
                        <Box>
                            <Typography variant="body2" color="primary">
                                {relValue.data.type}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                (ID: {relValue.data.id})
                            </Typography>
                        </Box>
                    }
                </Box>
            )
        ))
    );

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <AppBar position="static" sx={{ marginBottom: '1em', bgcolor: 'white', borderBottom: '1px solid grey' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'black' }}>
                        Resource Management
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container>
                <Grid container spacing={3}>
                    {resources.map((resource) => (
                        <Grid item xs={12} sm={6} md={4} key={resource}>
                            <Card onClick={() => handleCardClick(resource)} sx={{ cursor: 'pointer', border: '1px solid green' }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {resource}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>
                    {selectedResource}
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {resourceData.length > 0 ? (
                        resourceData.map((item, index) => (
                            <Box key={index} mb={3}>
                                {renderResourceDetails(item)}
                                {renderRelatedResources(item)}
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body1">Loading...</Typography>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default ResourceList;