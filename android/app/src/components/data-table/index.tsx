import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {DataTable} from 'react-native-paper';

type DataFormat = {
  [key: string]: string | number;
};

interface CustomDataTableProps {
  headers: string[];
  data: DataFormat[];
  onAction: (row: DataFormat) => void;
}

const CustomDataTable: React.FC<CustomDataTableProps> = ({
  headers,
  data,
  onAction,
}) => {
  const rowsPerPage = 5;
  const [page, setPage] = useState(0);

  const currentRows = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <View style={styles.containerParent}>
      <ScrollView horizontal style={styles.scrollView}>
        {' '}
        {/* Wrap table inside ScrollView */}
        <DataTable style={styles.dataTable}>
          <DataTable.Header style={styles.header}>
            {headers.map((header: string, index: number) => (
              <DataTable.Title key={index} textStyle={styles.headerText}>
                {header}
              </DataTable.Title>
            ))}
            <DataTable.Title>Action</DataTable.Title>{' '}
            {/* Add column for the action button */}
          </DataTable.Header>

          {currentRows.map((row: DataFormat, index: number) => (
            <DataTable.Row key={index} style={styles.row}>
              {Object.values(row).map((value, cellIndex) => (
                <DataTable.Cell key={cellIndex} style={styles.cell}>
                  {value}
                </DataTable.Cell>
              ))}
              <DataTable.Cell style={styles.cell}>
                {/* Custom Action Button */}
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onAction(row)}>
                  <Text style={styles.buttonText}>Open Register</Text>
                </TouchableOpacity>
              </DataTable.Cell>
            </DataTable.Row>
          ))}

          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(data.length / rowsPerPage)}
            onPageChange={handleChangePage}
            label={`${page * rowsPerPage + 1} - ${
              (page + 1) * rowsPerPage
            } of ${data.length}`}
          />
        </DataTable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerParent: {
    width: '100%',
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  dataTable: {
    backgroundColor: 'white',
    width: '100%',
  },
  scrollView: {
    marginHorizontal: 10,
  },
  header: {
    backgroundColor: 'rgb(250,250,250)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(240,240,240)',
  },
  headerText: {
    color: 'black',
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(240,240,240)',
  },
  cell: {
    minWidth: 100,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(237,105, 100)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    width: 120,
  },
  buttonText: {
    color: 'white',
    fontWeight: '400',
  },
});

export default CustomDataTable;
