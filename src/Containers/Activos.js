import React, {Component, Fragment} from 'react';
import Paper from "@material-ui/core/Paper";
import API from "../Utils/HttpMethods";
import {Table, TableHead, TableRow , TableBody,TableCell, TextField } from "@material-ui/core";


const fieldsDisplay = [
        {name: 'codigo', label: 'Codigo'},
        {name: 'nombre', label: 'Nombre'},
        {name: 'descripcion', label: 'Descripción'},
        {name: 'valorCompra', label: 'Valor Compra'},
        {name: 'fechaCompra', label: 'Fecha Compra'}
    ];

class Activos extends Component{
   constructor(props) {
        super(props);
        this.state = {
            resultData: [],
            selectedIndex: undefined,
            selectedRow: undefined,
            queryString: ''
        }
    }


    componentDidMount(){
        API.get("/activos").then(({data}) => this.setState({resultData: data})).catch((e) => console.log("Se ha generado el error", e))
    }


    render() {
        const {resultData, selectedIndex, queryString} = this.state;

        const headers = fieldsDisplay.map(({ label }, index) => (
            <TableCell
                classes={{ root: 'rootRowHeader', head: 'headerTable' }}
                key={index}
                style={{
                    paddingLeft: 5,
                    zIndex: 1
                }}
            >
                <span>{label}</span>
            </TableCell>
        ));

        const emptyContent = resultData.length === 0 && (
            <Fragment>
                <br />
                <span>No existe información asociada...</span>
            </Fragment>
        );

        const newResultData =  resultData.filter((row, index) => {
            if (!queryString) return true;
            return Object.keys(row).reduce(
                (prev, name) =>
                    prev ||
                    (String(row[name]).includes(queryString)),
                false
            );
        }).map((item) => ({...item, fechaCompra: new Date(item["fechaCompra"]).toISOString()
                .split('T')[0]}));


        const list = newResultData.map((row, index) => {
            return (
                <TableRow
                    classes={{
                        root: 'tableRowsM',
                        selected: 'rowSelected'
                    }}
                    className="rowOther"
                    key={index}
                    selected={selectedIndex === index}
                    style={{ cursor: undefined}}
                >
                    {fieldsDisplay.map(
                        (
                            { name, widthClass, alignClass, backgroundColor },
                            indexInternal
                        ) => {
                                let style;
                                if (row[name] !== '' && backgroundColor) {
                                    style = { backgroundColor };
                                }
                                return (
                                    <TableCell
                                        classes={{ root: 'rootRowHeader', head: 'headerTable' }}
                                        key={index + 'ctc' + +indexInternal}
                                        style={{
                                            textAlign: alignClass,
                                            width: widthClass,
                                            paddingLeft: 5,
                                            ...style
                                        }}
                                        onClick={() =>
                                            this.setState({selectedIndex: selectedIndex === index ? NaN : index, selectedRow: row})
                                        }
                                    >
                                        {row[name]}
                                    </TableCell>
                                );
                        }
                    )}
                </TableRow>
            );
        });

        return (
            <div className="container-fluid" style={{padding: '15px', marginBottom: '15px'}}>
                <Paper style={{padding: '10px', marginBottom: '15px', textAlign: 'center'}}>
                    <h1>Activos</h1>
                </Paper>
                <Paper style={{padding: '10px', marginBottom: '15px'}}>
                    <div className="col-6" style={{ paddingTop: 15, paddingLeft: 0 }}>
                        <TextField
                            fullWidth={true}
                            placeholder="filtros"
                            value={queryString}
                            onChange={(e) =>
                                this.setState({queryString: e.currentTarget.value})
                            }
                        />
                    </div>

                    <div style={{ height: "40vh", overflow: 'auto', marginTop: 5 }}>
                        <div style={{ width: 'auto' }}>
                            {!!emptyContent ? (
                                <Fragment>{emptyContent}</Fragment>
                            ) : (
                                <Table>
                                    <TableHead>
                                        <TableRow classes={{ root: 'tableRowsM' }}>{headers}</TableRow>
                                    </TableHead>
                                    <TableBody>{list}</TableBody>
                                </Table>
                            )}
                        </div>
                    </div>
                </Paper>
            </div>
        )
    }

}

export default Activos;