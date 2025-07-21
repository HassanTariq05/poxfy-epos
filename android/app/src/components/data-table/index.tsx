import React, {useState, useEffect, useRef, ReactNode} from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import {DataTable, Title} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import {Switch} from 'react-native-switch';
import Tooltip from 'react-native-walkthrough-tooltip';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type DataFormat = {
  [key: string]: string | number | boolean;
  isActive?: any;
};

interface CustomDataTableProps {
  flexes: number[];
  alignments: any[];
  headers: string[];
  data: {[key: string]: string | number}[];
  searchQuery?: string;
  showSwitch?: boolean;
  showOpenRegister?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showRefund?: boolean;
  editableFields?: string[];
  showInputButton?: boolean;
  onToggleSwitch?: (row: any, value: boolean) => void;
  onOpenRegister?: (row: DataFormat) => void;
  onEdit?: (row: any) => void;
  onRefund?: (row: any) => void;
  onDelete?: (row: DataFormat) => void;
  onInputChange?: (row: DataFormat, key: string, value: any) => void;
  onInputChangeForSet?: (row: DataFormat, key: string, value: string) => void;
  addDisabled?: boolean;
  highlightColumns?: boolean;
  underlineColumn?: boolean;
  toolTip?: boolean;
  propWidth?: number;
  count?: number;
  skip?: any;
  setSkip?: any;
  showLoyalty?: boolean;
  onLoyalty?: (row: any) => void;
}

const CustomDataTable: React.FC<CustomDataTableProps> = ({
  flexes,
  alignments,
  headers,
  data,
  searchQuery = '',
  onToggleSwitch,
  onOpenRegister,
  onEdit,
  onRefund,
  onDelete,
  onInputChange,
  onInputChangeForSet,
  showSwitch = false,
  showOpenRegister = false,
  showEdit = false,
  showDelete = false,
  showRefund,
  editableFields = [],
  showInputButton = false,
  addDisabled = false,
  highlightColumns = false,
  underlineColumn = false,
  toolTip = false,
  propWidth,
  count,
  skip,
  setSkip,
  showLoyalty = false,
  onLoyalty,
}) => {
  const rowsPerPage = 15;
  const [page, setPage] = useState(0);
  const [switchStates, setSwitchStates] = useState<Record<number, boolean>>({});
  const [inputValues, setInputValues] = useState<
    Record<number, Record<string, string>>
  >({});

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [outletTooltipVisible, setOutletTooltipVisible] = useState(false);

  const [tooltipContent, setTooltipContent] = useState('');
  const [outletTooltipContent, setOutletTooltipContent] = useState<ReactNode>();
  const [tooltipTarget, setTooltipTarget] = useState(null);
  const [outletTooltipTarget, setOutletTooltipTarget] = useState(null);
  const cellRefs = useRef<any>({});

  const [notes, setNotes] = useState('');
  const [notesForSet, setNotesForSet] = useState('');
  const [addTooltipVisible, setAddTooltipVisible] = useState(false);
  const [addTooltipContent, setAddTooltipContent] = useState('');
  const [addTooltipTarget, setAddTooltipTarget] = useState(null);
  const addCellRefs = useRef<any>({});

  const [SetTooltipVisible, setSetTooltipVisible] = useState(false);
  const [SetTooltipContent, setSetTooltipContent] = useState('');
  const [SetTooltipTarget, setSetTooltipTarget] = useState(null);
  const setCellRefs = useRef<any>({});

  useEffect(() => {
    const initialSwitchStates: Record<number, boolean> = {};
    data.forEach((row, index) => {
      initialSwitchStates[index] = Boolean(row.isActive);
    });
    setSwitchStates(initialSwitchStates);
  }, [data]);

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  const currentRows = filteredData.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage,
  );

  const toggleSwitch = (index: number, row: DataFormat) => {
    const newState = !switchStates[index];
    setSwitchStates(prev => ({...prev, [index]: newState}));

    if (onToggleSwitch) {
      onToggleSwitch(row, newState);
    }
  };

  const handleInputChange = (rowIndex: number, key: string, value: any) => {
    setInputValues(prev => ({
      ...prev,
      [rowIndex]: {
        ...prev[rowIndex],
        [key]: value,
      },
    }));
    setSelectedInputValue(value);
  };

  const [selectedRow, setSelectedRow] = useState();
  const [selectedRowIndex, setSelectedRowIndex] = useState<Number>();
  const [selectedInputValue, setSelectedInputValue] = useState<any>();

  const handleAddPress = (
    row: any,
    rowIndex: number,
    key: string,
    ref: any,
  ) => {
    setSelectedRow(row);
    setSelectedRowIndex(rowIndex);
    console.log(`Add button pressed for row ${rowIndex}, key: ${key}`);

    if (ref) {
      setAddTooltipTarget(ref);
      setAddTooltipVisible(true);
    }
  };

  const handleSetPress = (
    row: any,
    rowIndex: number,
    key: string,
    ref: any,
  ) => {
    setSelectedRow(row);
    setSelectedRowIndex(rowIndex);
    console.log(`Sett button pressed for row ${rowIndex}, key: ${key}`);
    console.log(`Sett button pressed for row`, row);

    if (ref) {
      setSetTooltipTarget(ref);
      setSetTooltipVisible(true);
    }
  };

  const handleCellClick = (cellIndex: any, cell: any, ref: any, row: any) => {
    if (toolTip && ref && cellIndex == 0) {
      console.log('Row Cell clicked: ', row);

      // Format Tooltip Content
      const tooltipText = `Product: ${row.name}\nSKU: ${row.skuNo}\nProduct Sku: ${row.barcode}\nRe-Order Level: ${row.reOrderLevel}`;

      setTooltipContent(tooltipText);
      setTooltipTarget(ref);
      setTooltipVisible(true);
    }

    if (toolTip && ref && cellIndex == 5) {
      console.log('Row Cell clicked: ', row);

      let tooltipElement;

      if (Array.isArray(row.breakdown)) {
        tooltipElement = (
          <View style={styles.modalContentView}>
            <View style={styles.titleView}>
              <Text style={styles.title}>Location/s</Text>
            </View>

            <View style={styles.contentView}>
              {row.breakdown.map((outlet: any, index: number) => (
                <View>
                  <View
                    style={[
                      styles.locationsView,
                      {
                        borderTopWidth: 1,
                        borderTopColor: 'rgb(240,240,240)',
                      },
                    ]}>
                    <View>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: 'black',
                          fontSize: 16,
                          paddingTop: 18,
                          alignSelf: 'center',
                        }}>
                        {outlet.outletName}
                      </Text>
                    </View>

                    <View style={styles.countView}>
                      <Text
                        style={[
                          styles.count,
                          {
                            color: 'black',
                            backgroundColor: 'rgb(240,250,255)', // Light blue
                          },
                        ]}>
                        {outlet.onHand}
                      </Text>

                      <Text
                        style={[
                          styles.count,
                          {
                            backgroundColor: 'rgb(255,245,230)', // Light orange
                          },
                        ]}>
                        {outlet.commited}
                      </Text>

                      <Text
                        style={[
                          styles.count,
                          {backgroundColor: 'rgb(240,255,240)'},
                        ]}>
                        {outlet.available}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        );
      }

      setOutletTooltipContent(tooltipElement);
      setOutletTooltipTarget(ref);
      setOutletTooltipVisible(true);
    }
  };

  const handleTooltipSubmit = (rowIndex: any, key: string, row: any) => {
    console.log('Row Index: ', rowIndex);
    console.log('Row: ', row);
    console.log('Note: ', notes);
    console.log('Input: ', selectedInputValue);
    if (onInputChange) {
      onInputChange(row, notes, selectedInputValue);
    }
    setAddTooltipVisible(false);
    setInputValues((prev: any) => {
      const clearedInputs = Object.keys(prev).reduce((acc, index) => {
        acc[Number(index)] = Object.keys(prev[index] || {}).reduce(
          (rowAcc: any, field) => {
            rowAcc[field] = '';
            return rowAcc;
          },
          {},
        );
        return acc;
      }, {} as Record<number, Record<string, string>>);

      return clearedInputs;
    });
    setSelectedInputValue('');
    setNotes('');
  };

  const handleSettTooltipSubmit = (rowIndex: any, key: string, row: any) => {
    console.log('Row Index for sett: ', rowIndex);
    console.log('Row for sett: ', row);
    console.log('Note for sett: ', notes);
    console.log('Input for sett: ', selectedInputValue);
    if (onInputChangeForSet) {
      onInputChangeForSet(row, notes, selectedInputValue);
    }
    setSetTooltipVisible(false);
    setInputValues((prev: any) => {
      const clearedInputs = Object.keys(prev).reduce((acc, index) => {
        acc[Number(index)] = Object.keys(prev[index] || {}).reduce(
          (rowAcc: any, field) => {
            rowAcc[field] = '';
            return rowAcc;
          },
          {},
        );
        return acc;
      }, {} as Record<number, Record<string, string>>);

      return clearedInputs;
    });
    setSelectedInputValue('');
    setNotes('');
  };

  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = () => {
    if (!notes.trim()) {
      setErrorMessage('Notes are required!');
      return;
    }
    setErrorMessage('');
    handleTooltipSubmit(selectedRowIndex, 'notes', selectedRow);
    setAddTooltipVisible(false);
    setNotes('');
  };

  const onSubmitForSet = () => {
    if (!notesForSet.trim()) {
      setErrorMessage('Notes are required!');
      return;
    }
    setErrorMessage('');
    handleSettTooltipSubmit(selectedRowIndex, 'notes', selectedRow);
    setAddTooltipVisible(false);
    setNotesForSet('');
  };

  const handlePageChange = (newPage: any) => {
    console.log('New page:', newPage);
    if (newPage < 0) return; // Prevent going below page 1
    setSkip(newPage);
  };

  return (
    <>
      <View style={(styles.dataTableView, {flex: 1})}>
        <ScrollView horizontal persistentScrollbar={true}>
          <ScrollView
            horizontal={false}
            persistentScrollbar={true}
            contentContainerStyle={{flexGrow: 1}}>
            <DataTable
              style={[styles.dataTable, propWidth ? {width: propWidth} : {}]}>
              <DataTable.Header style={styles.header}>
                {(showSwitch ||
                  showOpenRegister ||
                  showEdit ||
                  showDelete ||
                  showRefund) && (
                  <DataTable.Title
                    textStyle={styles.headerActionText}
                    style={{flex: 2}}>
                    <Text style={styles.headerActionTextInside}>Action</Text>
                  </DataTable.Title>
                )}
                {headers.map((header, index) => (
                  <DataTable.Title
                    style={{
                      flex: flexes[index],
                    }}
                    textStyle={{
                      color: 'black',
                      textAlign: alignments[index],
                      flex: 1,
                    }}>
                    {header}
                  </DataTable.Title>
                ))}
              </DataTable.Header>

              {currentRows.map((row, rowIndex) => (
                <DataTable.Row style={styles.row}>
                  {(showSwitch ||
                    showOpenRegister ||
                    showEdit ||
                    showDelete ||
                    showRefund) && (
                    <DataTable.Cell
                      style={{
                        flex: 2,
                        justifyContent: 'center',
                      }}>
                      {showSwitch && (
                        <View style={{paddingLeft: 5, paddingRight: 5}}>
                          <Switch
                            value={switchStates[rowIndex]}
                            onValueChange={() => toggleSwitch(rowIndex, row)}
                            disabled={false}
                            activeText=""
                            inActiveText=""
                            circleSize={22}
                            barHeight={24}
                            circleBorderWidth={1}
                            backgroundActive={'#eb6b6b'}
                            backgroundInactive={'#e0e0e0'}
                            circleActiveColor={'#fff'}
                            circleInActiveColor={'#fff'}
                            changeValueImmediately={true}
                            innerCircleStyle={{
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            switchLeftPx={10}
                            switchRightPx={10}
                            switchWidthMultiplier={1.6}
                          />
                        </View>
                      )}

                      {showOpenRegister && onOpenRegister && (
                        <TouchableOpacity
                          onPress={() => onOpenRegister(row)}
                          style={styles.actionButton}>
                          <Text style={styles.buttonText}>Open Register</Text>
                        </TouchableOpacity>
                      )}

                      {(showEdit || row['Payment Status'] == 'PARKED') &&
                        onEdit && (
                          <TouchableOpacity
                            onPress={() => onEdit(row)}
                            style={styles.editButton}>
                            <Feather name="edit-3" size={22} color="black" />
                          </TouchableOpacity>
                        )}

                      {showRefund &&
                        row['Sale Type'] != 'REFUND' &&
                        onRefund && (
                          <TouchableOpacity onPress={() => onRefund(row)}>
                            <Feather name="repeat" size={22} color="black" />
                          </TouchableOpacity>
                        )}

                      {showDelete && onDelete && (
                        <TouchableOpacity
                          onPress={() => onDelete(row)}
                          style={styles.crossButton}>
                          <Feather name="x" size={22} color="black" />
                        </TouchableOpacity>
                      )}

                      {showLoyalty && onLoyalty && (
                        <TouchableOpacity
                          onPress={() => onLoyalty(row)}
                          style={styles.crossButton}>
                          <Feather name="target" size={22} color="black" />
                        </TouchableOpacity>
                      )}
                    </DataTable.Cell>
                  )}

                  {headers.map((header, cellIndex) => {
                    let cellStyle;

                    if (highlightColumns) {
                      if (cellIndex === 1) cellStyle = styles.cellBlue;
                      if (cellIndex === 2) cellStyle = styles.cellOrange;
                      if (cellIndex === 3) cellStyle = styles.cellGreen;
                    }

                    return (
                      <DataTable.Cell
                        style={[
                          cellStyle,
                          {
                            flex: flexes[cellIndex],
                            justifyContent: alignments[cellIndex],
                            alignItems: 'center',
                          },
                        ]}>
                        {editableFields.includes(header) ? (
                          <View style={styles.editableView}>
                            {showInputButton && (
                              <TouchableOpacity
                                disabled={
                                  addDisabled ||
                                  !inputValues[rowIndex]?.[header]
                                } // Disable unless input has a value
                                onPress={() =>
                                  handleAddPress(
                                    row,
                                    rowIndex,
                                    header,
                                    addCellRefs.current[
                                      `${rowIndex}-${cellIndex}`
                                    ],
                                  )
                                }
                                ref={ref => {
                                  if (ref)
                                    addCellRefs.current[
                                      `${rowIndex}-${cellIndex}`
                                    ] = ref;
                                }}
                                style={[
                                  styles.addButton,
                                  (addDisabled ||
                                    !inputValues[rowIndex]?.[header]) && {
                                    backgroundColor:
                                      'rgba(230, 231, 235, 0.39)',
                                    borderColor: 'rgba(230, 231, 235, 0.39)',
                                  },
                                ]}>
                                <Text style={styles.inputButtonText}>Add</Text>
                              </TouchableOpacity>
                            )}

                            <TextInput
                              style={styles.input}
                              value={inputValues[rowIndex]?.[header] || ''}
                              onChangeText={text => {
                                const numericText = text.replace(
                                  /[^0-9.]/g,
                                  '',
                                );
                                if (/^\d*\.?\d*$/.test(numericText)) {
                                  handleInputChange(
                                    rowIndex,
                                    header,
                                    numericText,
                                  );
                                }
                              }}
                              keyboardType="numeric"
                            />

                            {showInputButton && (
                              <TouchableOpacity
                                disabled={
                                  addDisabled ||
                                  !inputValues[rowIndex]?.[header]
                                } // Disable unless input has a value
                                onPress={() =>
                                  handleSetPress(
                                    row,
                                    rowIndex,
                                    header,
                                    setCellRefs.current[
                                      `${rowIndex}-${cellIndex}`
                                    ],
                                  )
                                }
                                ref={ref => {
                                  if (ref)
                                    setCellRefs.current[
                                      `${rowIndex}-${cellIndex}`
                                    ] = ref;
                                }}
                                style={[
                                  styles.settButton,
                                  (addDisabled ||
                                    !inputValues[rowIndex]?.[header]) && {
                                    backgroundColor:
                                      'rgba(230, 231, 235, 0.39)',
                                    borderColor: 'rgba(230, 231, 235, 0.39)',
                                  },
                                ]}>
                                <Text style={styles.inputButtonText}>Set</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        ) : (
                          // Wrap non-editable cell text in a TouchableOpacity
                          <TouchableOpacity
                            ref={ref => {
                              if (ref)
                                cellRefs.current[`${rowIndex}-${cellIndex}`] =
                                  ref;
                            }}
                            onPress={() =>
                              handleCellClick(
                                cellIndex,
                                row[header],
                                cellRefs.current[`${rowIndex}-${cellIndex}`],
                                row,
                              )
                            }>
                            <Text
                              style={{
                                textAlign:
                                  cellIndex == 0 ? 'flex-start' : 'center',
                                textDecorationLine:
                                  underlineColumn && cellIndex == 0
                                    ? 'underline'
                                    : 'none',
                              }}>
                              {row[header]}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </DataTable.Cell>
                    );
                  })}
                </DataTable.Row>
              ))}

              <Modal
                visible={addTooltipVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setAddTooltipVisible(false)}>
                <View style={styles.notesModalOverlay}>
                  <View style={styles.notesModalContent}>
                    <TouchableOpacity
                      onPress={() => setAddTooltipVisible(false)}
                      style={styles.modalCloseButton}>
                      <MaterialCommunityIcons
                        name="close"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                    <View style={{padding: 8, width: 300}}>
                      <Text
                        style={{
                          color: 'black',
                          marginBottom: 5,
                          paddingRight: 25,
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}>
                        {`${selectedRow?.['Inventory Item']} - Add Quantity`}
                      </Text>
                      <Text
                        style={{
                          color: 'black',
                          marginBottom: 5,
                          fontWeight: 'bold',
                        }}>
                        Notes
                      </Text>
                      <TextInput
                        style={[
                          styles.inputNotes,
                          errorMessage ? styles.inputError : null,
                        ]}
                        placeholder="Enter your notes..."
                        value={notes}
                        onChangeText={text => {
                          setNotes(text);
                          if (text.trim()) setErrorMessage('');
                        }}
                        multiline={true}
                        numberOfLines={4}
                        textAlignVertical="top"
                      />
                      {errorMessage ? (
                        <Text style={styles.errorText1}>{errorMessage}</Text>
                      ) : null}

                      <TouchableOpacity
                        onPress={onSubmit}
                        style={styles.confirmButton}>
                        <Text style={{color: 'white'}}>Confirm</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

              <Modal
                visible={SetTooltipVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setSetTooltipVisible(false)}>
                <View style={styles.notesModalOverlay}>
                  <View style={styles.notesModalContent}>
                    <TouchableOpacity
                      onPress={() => setSetTooltipVisible(false)}
                      style={styles.modalCloseButton}>
                      <MaterialCommunityIcons
                        name="close"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                    <View style={{padding: 8, width: 300}}>
                      <Text
                        style={{
                          color: 'black',
                          marginBottom: 5,
                          paddingRight: 25,
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}>
                        {`${selectedRow?.['Inventory Item']} - Set Quantity`}
                      </Text>
                      <Text
                        style={{
                          color: 'black',
                          marginBottom: 5,
                          fontWeight: 'bold',
                        }}>
                        Notes
                      </Text>
                      <TextInput
                        style={[
                          styles.inputNotes,
                          errorMessage ? styles.inputError : null,
                        ]}
                        placeholder="Enter your notes..."
                        value={notesForSet}
                        onChangeText={text => {
                          setNotesForSet(text);
                          if (text.trim()) setErrorMessage('');
                        }}
                        multiline={true}
                        numberOfLines={4}
                        textAlignVertical="top"
                      />
                      {errorMessage ? (
                        <Text style={styles.errorText1}>{errorMessage}</Text>
                      ) : null}

                      <TouchableOpacity
                        onPress={onSubmitForSet}
                        style={styles.confirmButton}>
                        <Text style={{color: 'white'}}>Confirm</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

              <Modal
                visible={tooltipVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setTooltipVisible(false)}>
                <View style={styles.overlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.text}>{tooltipContent}</Text>
                    <View style={styles.closeButtonView}>
                      <TouchableOpacity
                        onPress={() => setTooltipVisible(false)}
                        style={styles.closeButton2}>
                        <Text style={styles.closeText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

              <Modal
                visible={outletTooltipVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setOutletTooltipVisible(false)}>
                <View style={styles.overlay1}>
                  <View style={styles.modalContent1}>
                    {outletTooltipContent}
                    <TouchableOpacity
                      onPress={() => setOutletTooltipVisible(false)}
                      style={styles.closeButton1}>
                      <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </DataTable>
          </ScrollView>
        </ScrollView>

        {!count && (
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(filteredData.length / rowsPerPage)}
            onPageChange={setPage}
            label={`${page * rowsPerPage + 1} - ${Math.min(
              (page + 1) * rowsPerPage,
              filteredData.length,
            )} of ${filteredData.length}`}
          />
        )}

        {count && (
          <DataTable.Pagination
            page={skip}
            numberOfPages={Math.ceil(count / rowsPerPage)}
            onPageChange={handlePageChange}
            label={`${skip * rowsPerPage + 1} - ${Math.min(
              (skip + 1) * rowsPerPage,
              count,
            )} of ${count}`}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  dataTableView: {
    height: 'auto',
  },
  scrollView: {width: '100%'},
  dataTable: {
    width: 1000,
    backgroundColor: 'white',
    minWidth: '100%',
    height: 'auto',
  },
  header: {
    backgroundColor: 'rgb(250, 250, 250)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(240, 240, 240)',
  },
  headerText: {
    color: 'black',
    textAlign: 'center',
    flex: 1,
  },

  headerText1: {
    color: 'black',
    textAlign: 'center',
  },
  headerActionText: {
    color: 'black',
    textAlign: 'center',
    flex: 1,
  },
  headerActionTextInside: {
    textAlign: 'center',
    flex: 1,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(237,105,100)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 11,
  },
  row: {borderBottomWidth: 1, borderBottomColor: 'rgb(240,240,240)'},
  cell: {
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cell1: {
    width: 40,
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
    zIndex: 10,
  },
  actionCell: {
    paddingRight: 0,
    textAlign: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    width: 80,
    textAlign: 'center',
  },
  inputNotes: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 5,
    minHeight: 80, // Adjust height as needed
    maxHeight: 150,
    width: '100%',
    textAlign: 'left',
  },
  inputError: {
    borderColor: 'red', // Highlight border in red when error occurs
  },
  errorText1: {
    color: 'red',
    fontSize: 12,
  },
  // confirmButton: {
  //   backgroundColor: 'rgb(230,231,235)',
  //   padding: 8,
  //   borderRadius: 5,
  //   alignItems: 'center',
  //   marginTop: 10,
  // },
  confirmButton: {
    backgroundColor: '#ED6964',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  switch: {alignSelf: 'flex-start'},
  editButton: {
    alignSelf: 'flex-start',
    paddingBottom: 5,
    paddingHorizontal: 10,
  },
  crossButton: {
    alignSelf: 'flex-start',
    paddingBottom: 5,
  },
  errorText: {color: 'red', textAlign: 'center', marginVertical: 10},
  editableView: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'none',
    paddingVertical: 2,
    paddingHorizontal: 2,
    borderRadius: 4,
    width: 40,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  settButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(230,231,235)',
    paddingVertical: 2,
    paddingHorizontal: 2,
    borderRadius: 4,
    width: 40,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  inputButtonText: {
    color: 'black',
  },
  // Styles for the info dialog modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  dialogText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: 'rgb(237,105,100)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  cellBlue: {
    backgroundColor: 'rgb(244, 253, 255)',
    padding: 10,
  },

  cellGreen: {
    backgroundColor: 'rgb(248, 255,239)',
    padding: 10,
  },

  cellOrange: {
    backgroundColor: 'rgb(254,248, 238)', // Light Yellow for 4th column
    padding: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay1: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.24)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  notesModalContent: {
    backgroundColor: 'rgb(255, 255, 255)',
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalContent1: {
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 8,
    alignItems: 'flex-start',
    width: 400,
  },
  text: {
    color: 'white',
    marginBottom: 10,
  },
  closeButton1: {
    backgroundColor: 'rgb(218, 218, 218)',
    padding: 10,
    borderRadius: 8,
    margin: 10,
    width: '95%',
    textAlign: 'center',
    justifyContent: 'center',
  },

  closeButton2: {
    backgroundColor: 'rgb(218, 218, 218)',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    textAlign: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#000',
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    width: '100%',
  },
  modalContentView: {
    width: '100%',
  },
  titleView: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 15,
    width: '100%',
    backgroundColor: 'rgb(240, 240, 240)',
  },
  contentView: {
    padding: 15,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  locationsView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countView: {
    display: 'flex',
    flexDirection: 'row',
    width: 130,
  },
  count: {
    color: 'black',
    // paddingHorizontal: 20,
    paddingVertical: 20,
    width: '33.33%',
    alignContent: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
  closeButtonView: {
    backgroundColor: 'none',
    width: 180,
  },
});

export default CustomDataTable;
