import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Modal,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Remove unused import
// import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';

// Type definitions for our data
type MeasurementHistory = {
  date: string;
  value: number;
};

type MeasurementData = {
  current: number;
  unit: string;
  history: MeasurementHistory[];
};

type Measurements = {
  weight: MeasurementData;
  bodyFat: MeasurementData;
  chestCircumference: MeasurementData;
  waistCircumference: MeasurementData;
  [key: string]: MeasurementData; // Add index signature for dynamic access
};

type Period = '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';

type ChartData = {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
  legend?: string[];
};

// Mock user data - assuming similar structure to ProfileScreen
const userData = {
  measurements: {
    weight: {
      current: 180,
      unit: 'lbs',
      history: [
        { date: '2023-01-01', value: 195 },
        { date: '2023-02-01', value: 190 },
        { date: '2023-03-01', value: 185 },
        { date: '2023-04-01', value: 180 },
      ]
    },
    bodyFat: {
      current: 18,
      unit: '%',
      history: [
        { date: '2023-01-01', value: 22 },
        { date: '2023-02-01', value: 20 },
        { date: '2023-03-01', value: 19 },
        { date: '2023-04-01', value: 18 },
      ]
    },
    chestCircumference: {
      current: 42,
      unit: 'inches',
      history: [
        { date: '2023-01-01', value: 40 },
        { date: '2023-02-01', value: 41 },
        { date: '2023-03-01', value: 41.5 },
        { date: '2023-04-01', value: 42 },
      ]
    },
    waistCircumference: {
      current: 34,
      unit: 'inches',
      history: [
        { date: '2023-01-01', value: 38 },
        { date: '2023-02-01', value: 36 },
        { date: '2023-03-01', value: 35 },
        { date: '2023-04-01', value: 34 },
      ]
    },
  } as Measurements,
};

const ProgressTrackingScreen = () => {
  const [selectedMeasurement, setSelectedMeasurement] = useState<keyof Measurements>('weight');
  const [period, setPeriod] = useState<Period>('1M');
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newMeasurementValue, setNewMeasurementValue] = useState('');
  const [newMeasurementDate, setNewMeasurementDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    generateChartData();
  }, [selectedMeasurement, period]);

  const generateChartData = () => {
    setLoading(true);

    // Get the selected measurement history
    let historyData = [...userData.measurements[selectedMeasurement].history];
    
    // Sort data chronologically
    historyData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Filter data based on selected period
    const filteredData = filterDataByPeriod(historyData, period);
    
    // Format dates for labels
    const labels = filteredData.map(item => formatDateForDisplay(item.date));
    
    // Get values for the dataset
    const values = filteredData.map(item => item.value);
    
    // Create chart data object
    const newChartData: ChartData = {
      labels,
      datasets: [
        {
          data: values,
          color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };
    
    setChartData(newChartData);
    setLoading(false);
  };
  
  // Fix the for loop to a for-of loop, and fix the Date assignment issue
  const filterDataByPeriod = (data: MeasurementHistory[], selectedPeriod: Period): MeasurementHistory[] => {
    if (selectedPeriod === 'ALL') return data;
    
    const cutoffDate = new Date();
    
    switch (selectedPeriod) {
      case '1W': cutoffDate.setDate(cutoffDate.getDate() - 7); break;
      case '1M': cutoffDate.setMonth(cutoffDate.getMonth() - 1); break;
      case '3M': cutoffDate.setMonth(cutoffDate.getMonth() - 3); break;
      case '6M': cutoffDate.setMonth(cutoffDate.getMonth() - 6); break;
      case '1Y': cutoffDate.setFullYear(cutoffDate.getFullYear() - 1); break;
    }
    
    // Using for-of instead of for loop as suggested by the linter
    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getTime() >= cutoffDate.getTime();
    });
  };
  
  const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };
  
  const formatFullDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleAddMeasurement = () => {
    // Convert the value to a number
    const valueNum = parseFloat(newMeasurementValue);
    
    // Validate the input
    if (isNaN(valueNum)) {
      alert('Please enter a valid number');
      return;
    }
    
    // Format the date as YYYY-MM-DD for consistency
    const formattedDate = newMeasurementDate.toISOString().split('T')[0];
    
    // In a real app, this would update the actual data source
    // For this example, let's just update our local state
    const updatedData = [...userData.measurements[selectedMeasurement].history];
    updatedData.push({
      date: formattedDate,
      value: valueNum
    });
    
    // Update the measurement data
    userData.measurements[selectedMeasurement].history = updatedData;
    userData.measurements[selectedMeasurement].current = valueNum;
    
    // Regenerate chart data
    generateChartData();
    
    // Reset and close modal
    setNewMeasurementValue('');
    setNewMeasurementDate(new Date());
    setAddModalVisible(false);
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNewMeasurementDate(selectedDate);
    }
  };
  
  // Get measurement friendly name
  const getMeasurementName = (key: keyof Measurements): string => {
    switch (key) {
      case 'weight': return 'Weight';
      case 'bodyFat': return 'Body Fat';
      case 'chestCircumference': return 'Chest';
      case 'waistCircumference': return 'Waist';
      default: return key;
    }
  };
  
  const renderPeriodSelector = () => {
    const periods: Period[] = ['1W', '1M', '3M', '6M', '1Y', 'ALL'];
    
    return (
      <View style={styles.periodSelector}>
        {periods.map(p => (
          <TouchableOpacity
            key={p}
            style={[styles.periodButton, period === p && styles.periodButtonActive]}
            onPress={() => setPeriod(p)}
          >
            <Text style={[styles.periodButtonText, period === p && styles.periodButtonTextActive]}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  const renderMeasurementSelector = () => {
    const measurements: Array<keyof Measurements> = ['weight', 'bodyFat', 'chestCircumference', 'waistCircumference'];
    
    return (
      <View style={styles.measurementSelector}>
        {measurements.map((m) => (
          <TouchableOpacity
            key={m}
            style={[
              styles.measurementButton,
              selectedMeasurement === m && styles.measurementButtonActive
            ]}
            onPress={() => setSelectedMeasurement(m)}
          >
            <Text style={[
              styles.measurementButtonText,
              selectedMeasurement === m && styles.measurementButtonTextActive
            ]}>
              {getMeasurementName(m)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  const renderChart = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      );
    }
    
    if (!chartData || chartData.datasets[0].data.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Ionicons name="analytics-outline" size={48} color="#bdc3c7" />
          <Text style={styles.noDataText}>No data available for this period</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setAddModalVisible(true)}
          >
            <Text style={styles.addButtonText}>Add Measurement</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    const unit = userData.measurements[selectedMeasurement]?.unit ?? '';
    const current = userData.measurements[selectedMeasurement]?.current ?? 0;
    
    return (
      <View style={styles.chartContainer}>
        <View style={styles.currentValueContainer}>
          <Text style={styles.currentValueLabel}>Current</Text>
          <Text style={styles.currentValue}>{current} {unit}</Text>
        </View>
        
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#3498db',
            },
          }}
          bezier
          style={styles.chart}
        />
        
        <View style={styles.chartFooter}>
          <TouchableOpacity 
            style={styles.addDataButton}
            onPress={() => setAddModalVisible(true)}
          >
            <Ionicons name="add-circle-outline" size={20} color="#3498db" />
            <Text style={styles.addDataButtonText}>Add Data Point</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const renderAddModal = () => {
    return (
      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Add {getMeasurementName(selectedMeasurement)}
            </Text>
            
            <Text style={styles.modalInputLabel}>Value:</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={newMeasurementValue}
                onChangeText={setNewMeasurementValue}
                keyboardType="numeric"
                placeholder={`Enter ${getMeasurementName(selectedMeasurement).toLowerCase()}`}
              />
              <Text style={styles.inputUnit}>
                {userData.measurements[selectedMeasurement]?.unit}
              </Text>
            </View>
            
            <Text style={styles.modalInputLabel}>Date:</Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateInputText}>
                {formatFullDate(newMeasurementDate)}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#7f8c8d" />
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={newMeasurementDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButtonSecondary}
                onPress={() => {
                  setAddModalVisible(false);
                  setNewMeasurementValue('');
                  setNewMeasurementDate(new Date());
                }}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButtonPrimary}
                onPress={handleAddMeasurement}
              >
                <Text style={styles.modalButtonPrimaryText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress Tracking</Text>
        <Text style={styles.subtitle}>
          Track your fitness journey with these measurements
        </Text>
      </View>
      
      {renderMeasurementSelector()}
      {renderPeriodSelector()}
      {renderChart()}
      {renderAddModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  measurementSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    paddingBottom: 8,
  },
  measurementButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
  },
  measurementButtonActive: {
    backgroundColor: '#3498db',
  },
  measurementButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  measurementButtonTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 0,
  },
  periodButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#ecf0f1',
  },
  periodButtonActive: {
    backgroundColor: '#3498db',
  },
  periodButtonText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  periodButtonTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  chartContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currentValueContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  currentValueLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  currentValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartFooter: {
    marginTop: 16,
    alignItems: 'center',
  },
  addDataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  addDataButtonText: {
    fontSize: 14,
    color: '#3498db',
    marginLeft: 4,
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataContainer: {
    height: 300,
    margin: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noDataText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#3498db',
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  modalInputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginTop: 12,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 16,
  },
  inputUnit: {
    position: 'absolute',
    right: 12,
    color: '#7f8c8d',
    fontSize: 16,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dateInputText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButtonSecondary: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#95a5a6',
    marginRight: 8,
    alignItems: 'center',
  },
  modalButtonSecondaryText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '500',
  },
  modalButtonPrimary: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#3498db',
    marginLeft: 8,
    alignItems: 'center',
  },
  modalButtonPrimaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProgressTrackingScreen;