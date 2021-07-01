import React, {Component} from 'react';
import Box from '@material-ui/core/Box';
import {Link as RouterLink} from 'react-router-dom';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';


import Divider from '../components/divider';
import Table from '../components/table';
import InfoCard from '../components/garden_admin_info_card';
import PageHeader from '../components/page_header';
import GardenForm from '../components/garden_view_form';
import GardenService from '../services/garden_service';

type MyProps = {
    match: any;
}
type MyState = {
    data: any;
    page: number;
    totalItems: number | null;
    rowsPerPage: number;
    tableKeys: string[];
    tableHeads: string[];
    dataForm: any,
    errors: any[],
}

class GardenViewApp extends Component<MyProps, MyState> {

    schema = GardenService.SCHEMA;
    uischema = GardenService.UISCHEMA;
    initialModel = {};
    state: MyState = {
        data: [],
        page: 0,
        totalItems: null,
        rowsPerPage: 5,
        tableKeys: ['namespace', 'name', 'version',],
        tableHeads: ['Namespace', 'System', 'Version',],
        dataForm: {},
        errors: [],
    }
    title = "Garden View";
    garden_name: string = "";
    system_data: any;
    garden: any = null;

    componentDidMount() {
        const {garden_name} = this.props.match.params
        this.garden_name = garden_name;

        GardenService.getGarden(this, garden_name);
    }

    formatData(data: any) {
        let tempData: any = [];
        for (let i in data.systems) {
            let system = data.systems[i];
            for (let tableKey in this.state.tableKeys) {
                if (!tempData[i]) {
                    tempData[i] = {};
                }
                if (this.state.tableKeys[tableKey] === "version") {
                    tempData[i][this.state.tableKeys[tableKey]] = (
                        <RouterLink to={['/systems', system.namespace, system.name, system.version].join('/')}>
                            {system[this.state.tableKeys[tableKey]]}
                        </RouterLink>
                    );
                } else if (this.state.tableKeys[tableKey] === "namespace") {
                    tempData[i][this.state.tableKeys[tableKey]] = (
                        <RouterLink to={['/systems', system.namespace].join('/')}>
                            {system[this.state.tableKeys[tableKey]]}
                        </RouterLink>
                    )
                } else {
                    tempData[i][this.state.tableKeys[tableKey]] = system[this.state.tableKeys[tableKey]];
                }
            }
        }
        return tempData;
    }

    updateData() {
        let state = this.state;
        let newData = this.system_data.slice(state.page * state.rowsPerPage, (state.page * state.rowsPerPage + state.rowsPerPage));
        this.setState({data: newData})
    }

    successCallback(response: any) {
        this.garden = response.data
        this.system_data = this.formatData(this.garden)
        let state = this.state;
        let data = this.system_data.slice(state.page * state.rowsPerPage, (state.page * state.rowsPerPage + state.rowsPerPage));
        this.initialModel = GardenService.serverModelToForm(this.garden);
        this.setState({data: data, totalItems: this.garden.systems.length, dataForm: this.initialModel});
    }

    getConfigSetup() {
        if (this.garden.connection_type === "LOCAL") {
            return (
                <Alert
                    severity="info">{"Since this is the local Garden it's not possible to modify connection information"}</Alert>
            );
        } else {
            return (<GardenForm self={this} schema={this.schema} uischema={this.uischema}/>);
        }
    }

    renderComponents() {
        if (this.state.data[0]) {
            return (
                <Box>
                    <InfoCard garden={this.garden}/>
                    <Table self={this} includePageNav={true} disableSearch={true}/>
                    <Box pt={1}><Typography variant="h6">Update Connection</Typography></Box>
                    {this.getConfigSetup()}
                </Box>
            )
        } else {
            return (
                <Backdrop open={true}>
                    <CircularProgress color="inherit"/>
                </Backdrop>
            )
        }
    }

    render() {
        return (
            <Box pb={10}>
                <Grid
                    justify="space-between"
                    container
                >
                    <Grid item>
                        <PageHeader title={this.title} description={""}/>
                    </Grid>
                    <Grid item>
                        <Typography style={{flex: 1}}>
                            <Button variant="contained" color="primary"
                                    onClick={() => GardenService.syncGarden(this.garden_name)}>Sync</Button>
                        </Typography>
                    </Grid>
                </Grid>
                <Divider/>
                {this.renderComponents()}
            </Box>
        )
    }
}

export default GardenViewApp;