// src/screens/nutrition/NutritionScreen.tsx
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
 //FlatList,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

// Mock data for nutrition tracking
const nutritionPrinciples = [
  {
    id: '1',
    title: 'Eliminate Added Sugar',
    description: 'Cut out added sugar, particularly in the form of empty liquid calories, to promote fat loss.',
    tip: 'Read labels carefully. Added sugar hides in many processed foods, especially beverages.',
    icon: 'close-circle',
    color: '#e74c3c',
  },
  {
    id: '2',
    title: 'Increase Protein Intake',
    description: 'Focus on increasing your intake of protein to support muscle growth and repair.',
    tip: 'Aim for protein at every meal. Good sources include lean meats, fish, eggs, dairy, and legumes.',
    icon: 'restaurant',
    color: '#3498db',
  },
  {
    id: '3',
    title: 'Eat More Produce',
    description: 'Fill your plate with vegetables and fruits to provide essential nutrients and fiber.',
    tip: 'Try to make half of each meal vegetables. Eat a variety of colors to get different nutrients.',
    icon: 'leaf',
    color: '#2ecc71',
  },
  {
    id: '4',
    title: 'Limit Carbs',
    description: 'Try to limit your daily carb intake to around 100 grams, and eat most of your non-vegetable carbohydrates after your workouts.',
    tip: 'Time your carb intake around your workouts when your body can best utilize them for muscle recovery.',
    icon: 'timer',
    color: '#f39c12',
  },
];

// Sample meal data
const mealData = [
  {
    id: 'm1',
    date: new Date().toISOString(),
    meals: [
      {
        id: '1',
        type: 'Breakfast',
        time: '7:30 AM',
        items: [
          { name: 'Eggs', portion: '3 whole', category: 'Protein' },
          { name: 'Spinach', portion: '1 cup', category: 'Vegetable' },
          { name: 'Avocado', portion: '1/2', category: 'Healthy Fat' },
        ],
        notes: 'Felt energized after this meal',
      },
      {
        id: '2',
        type: 'Lunch',
        time: '12:30 PM',
        items: [
          { name: 'Grilled Chicken', portion: '6 oz', category: 'Protein' },
          { name: 'Mixed Greens', portion: '2 cups', category: 'Vegetable' },
          { name: 'Olive Oil & Vinegar', portion: '1 tbsp', category: 'Healthy Fat' },
          { name: 'Sweet Potato', portion: '1/2 medium', category: 'Carbohydrate' },
        ],
        notes: 'Post-workout meal',
      },
      {
        id: '3',
        type: 'Dinner',
        time: '6:30 PM',
        items: [
          { name: 'Salmon', portion: '5 oz', category: 'Protein' },
          { name: 'Broccoli', portion: '1 cup', category: 'Vegetable' },
          { name: 'Brown Rice', portion: '1/2 cup', category: 'Carbohydrate' },
        ],
        notes: '',
      },
      {
        id: '4',
        type: 'Snack',
        time: '3:30 PM',
        items: [
          { name: 'Greek Yogurt', portion: '1 cup', category: 'Protein' },
          { name: 'Berries', portion: '1/2 cup', category: 'Fruit' },
          { name: 'Almonds', portion: '1/4 cup', category: 'Healthy Fat' },
        ],
        notes: '',
      },
    ],
    water: 7, // cups
    habits: {
      noAddedSugar: true,
      adequateProtein: true,
      adequateProduce: true,
      limitedCarbs: true,
    },
    notes: 'Felt great today. High energy during my afternoon workout.',
  },
];

// Category color mapping
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Protein': return '#e67e22';
    case 'Vegetable': return '#2ecc71';
    case 'Healthy Fat': return '#f1c40f';
    case 'Carbohydrate': return '#3498db';
    case 'Fruit': return '#9b59b6';
    default: return '#bdc3c7';
  }
};

// Nutrition Principle Card Component
const NutritionPrincipleCard = ({ principle }: { principle: any }) => (
  <View style={[styles.principleCard, { borderLeftColor: principle.color }]}>
    <View style={styles.principleHeader}>
      <Ionicons name={principle.icon} size={24} color={principle.color} />
      <Text style={styles.principleTitle}>{principle.title}</Text>
    </View>
    <Text style={styles.principleDescription}>{principle.description}</Text>
    <View style={styles.tipContainer}>
      <Text style={styles.tipLabel}>Tip:</Text>
      <Text style={styles.tipText}>{principle.tip}</Text>
    </View>
  </View>
);

// Meal Card Component
const MealCard = ({ meal, onPress }: { meal: any; onPress: (meal: any) => void }) => {
  const categoryCounts = meal.items.reduce((acc: Record<string, number>, item: any) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
  
  return (
    <TouchableOpacity style={styles.mealCard} onPress={() => onPress(meal)}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealType}>{meal.type}</Text>
        <Text style={styles.mealTime}>{meal.time}</Text>
      </View>
      <View style={styles.mealCategories}>
        {Object.entries(categoryCounts).map(([category, count]) => (
          <View key={category} style={[styles.categoryBadge, { backgroundColor: getCategoryColor(category) }]}>
            <Text style={styles.categoryText}>{category} ({count})</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

// Add Meal Modal Component
const AddMealModal = ({ visible, onClose, onSave }) => {
  const [selectedType, setSelectedType] = useState('Breakfast');
  
  // Meal types
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add a Meal</Text>
          
          <Text style={styles.sectionLabel}>Meal Type:</Text>
          <View style={styles.mealTypeContainer}>
            {mealTypes.map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.mealTypeButton,
                  selectedType === type && styles.mealTypeButtonActive
                ]}
                onPress={() => setSelectedType(type)}
              >
                <Text
                  style={[
                    styles.mealTypeText,
                    selectedType === type && styles.mealTypeTextActive
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.sectionLabel}>Simple Tracking:</Text>
          <Text style={styles.infoText}>
            Instead of counting calories, focus on building a balanced meal with these components:
          </Text>
          
          <View style={styles.mealComponentsList}>
            <View style={styles.mealComponent}>
              <View style={[styles.componentDot, { backgroundColor: '#3498db' }]} />
              <Text style={styles.componentText}>Protein (palm-sized portion)</Text>
            </View>
            <View style={styles.mealComponent}>
              <View style={[styles.componentDot, { backgroundColor: '#2ecc71' }]} />
              <Text style={styles.componentText}>Vegetables (fist-sized portion)</Text>
            </View>
            <View style={styles.mealComponent}>
              <View style={[styles.componentDot, { backgroundColor: '#f1c40f' }]} />
              <Text style={styles.componentText}>Healthy Fats (thumb-sized portion)</Text>
            </View>
            <View style={styles.mealComponent}>
              <View style={[styles.componentDot, { backgroundColor: '#e67e22' }]} />
              <Text style={styles.componentText}>Carbs (cupped hand portion)</Text>
            </View>
          </View>
          
          <Text style={styles.infoTextBold}>
            In a full app implementation, you would be able to add specific foods here.
          </Text>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButtonSecondary} onPress={onClose}>
              <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalButtonPrimary} 
              onPress={() => {
                onSave({
                  id: Date.now().toString(),
                  type: selectedType,
                  time: new Date().toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: 'numeric',
                    hour12: true 
                  }),
                  items: [
                    { name: 'Sample Protein', portion: '4 oz', category: 'Protein' },
                    { name: 'Sample Vegetable', portion: '1 cup', category: 'Vegetable' },
                  ],
                  notes: '',
                });
              }}
            >
              <Text style={styles.modalButtonPrimaryText}>Save Meal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Daily Habits Component
const DailyHabits = ({ habits, onToggle }) => {
  return (
    <View style={styles.habitsContainer}>
      <Text style={styles.habitsTitle}>Daily Nutrition Habits</Text>
      
      <View style={styles.habitItem}>
        <Text style={styles.habitText}>No added sugar today</Text>
        <Switch
          value={habits.noAddedSugar}
          onValueChange={(value) => onToggle('noAddedSugar', value)}
          trackColor={{ false: '#bdc3c7', true: '#2ecc71' }}
          thumbColor={habits.noAddedSugar ? '#27ae60' : '#ecf0f1'}
        />
      </View>
      
      <View style={styles.habitItem}>
        <Text style={styles.habitText}>Met protein target</Text>
        <Switch
          value={habits.adequateProtein}
          onValueChange={(value) => onToggle('adequateProtein', value)}
          trackColor={{ false: '#bdc3c7', true: '#2ecc71' }}
          thumbColor={habits.adequateProtein ? '#27ae60' : '#ecf0f1'}
        />
      </View>
      
      <View style={styles.habitItem}>
        <Text style={styles.habitText}>Ate enough produce</Text>
        <Switch
          value={habits.adequateProduce}
          onValueChange={(value) => onToggle('adequateProduce', value)}
          trackColor={{ false: '#bdc3c7', true: '#2ecc71' }}
          thumbColor={habits.adequateProduce ? '#27ae60' : '#ecf0f1'}
        />
      </View>
      
      <View style={styles.habitItem}>
        <Text style={styles.habitText}>Limited carbs</Text>
        <Switch
          value={habits.limitedCarbs}
          onValueChange={(value) => onToggle('limitedCarbs', value)}
          trackColor={{ false: '#bdc3c7', true: '#2ecc71' }}
          thumbColor={habits.limitedCarbs ? '#27ae60' : '#ecf0f1'}
        />
      </View>
    </View>
  );
};

// Water Tracker Component
const WaterTracker = ({ cups, onUpdate }) => {
  return (
    <View style={styles.waterTrackerContainer}>
      <View style={styles.waterHeader}>
        <Text style={styles.waterTitle}>Water Intake</Text>
        <Text style={styles.waterAmount}>{cups} cups</Text>
      </View>
      
      <View style={styles.waterCupsContainer}>
        {[...Array(8)].map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.waterCup,
              index < cups && styles.waterCupFilled
            ]}
            onPress={() => onUpdate(index + 1)}
          >
            <Ionicons
              name="water"
              size={20}
              color={index < cups ? 'white' : '#bdc3c7'}
            />
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={styles.waterTip}>Tap to set your current water intake</Text>
    </View>
  );
};

// Nutrition Main Screen
const NutritionMainScreen = () => {
  const [mealData, setMealData] = useState([
    {
      // First day's data structure
      meals: [],
      habits: {
        protein: false,
        veggies: false,
        hydration: false,
        // Add other habit defaults as needed
      },
      water: 0
      // Add other properties as needed
    }
  ]);
  const [currentDate] = useState(new Date());
  const [addMealModalVisible, setAddMealModalVisible] = useState(false);
  
  // For demo purposes, use the first record
  const dailyData = mealData[0];
  
  const handleAddMeal = (newMeal) => {
    // In a real app, this would add to the current day's meals
    setAddMealModalVisible(false);
    console.log('New meal added:', newMeal);
   
    // Sample implementation to update UI for demo
    const updatedMealData = [...mealData];
    updatedMealData[0].meals.push(newMeal);
    setMealData(updatedMealData);
  };
 
  const handleToggleHabit = (habitName, value) => {
    // In a real app, this would update the current day's habits
    console.log('Habit toggled:', habitName, value);
   
    // Sample implementation to update UI for demo
    const updatedMealData = [...mealData];
    updatedMealData[0].habits[habitName] = value;
    setMealData(updatedMealData);
  };
 
  const handleUpdateWater = (cups) => {
    // In a real app, this would update the current day's water intake
    console.log('Water updated:', cups);
   
    // Sample implementation to update UI for demo
    const updatedMealData = [...mealData];
    updatedMealData[0].water = cups;
    setMealData(updatedMealData);
  };
 
  return (
    <ScrollView style={styles.container}>
      <View style={styles.dateHeader}>
        <Text style={styles.dateText}>
          {currentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
      </View>
     
      <DailyHabits
        habits={dailyData.habits}
        onToggle={handleToggleHabit}
      />
     
      <WaterTracker
        cups={dailyData.water}
        onUpdate={handleUpdateWater}
      />
     
      <View style={styles.mealsContainer}>
        <View style={styles.mealsHeader}>
          <Text style={styles.mealsTitle}>Today's Meals</Text>
          <TouchableOpacity
            style={styles.addMealButton}
            onPress={() => setAddMealModalVisible(true)}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.addMealButtonText}>Add Meal</Text>
          </TouchableOpacity>
        </View>
       
        {dailyData.meals.map(meal => (
          <MealCard
            key={meal.id}
            meal={meal}
            onPress={() => console.log('Meal pressed:', meal)}
          />
        ))}
      </View>
     
      <View style={styles.principlesContainer}>
        <Text style={styles.principlesTitle}>Nutrition Principles</Text>
        <Text style={styles.principlesSubtitle}>
          Follow these key principles from the "No Gym Required" book to optimize your nutrition
        </Text>
       
        {nutritionPrinciples.map(principle => (
          <NutritionPrincipleCard key={principle.id} principle={principle} />
        ))}
      </View>
     
      <AddMealModal
        visible={addMealModalVisible}
        onClose={() => setAddMealModalVisible(false)}
        onSave={handleAddMeal}
      />
    </ScrollView>
  );
};

// Create Stack Navigator for Nutrition
const Stack = createStackNavigator();

const NutritionScreen = () => {
  const [selectedMeal, setSelectedMeal] = useState<any | null>(null);
  const todayMeals = mealData[0]?.meals || [];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Nutrition Principles</Text>
      {nutritionPrinciples.map((principle) => (
        <NutritionPrincipleCard key={principle.id} principle={principle} />
      ))}

      <Text style={styles.header}>Today's Meals</Text>
      {todayMeals.map((meal) => (
        <MealCard key={meal.id} meal={meal} onPress={setSelectedMeal} />
      ))}

      <Modal visible={!!selectedMeal} animationType="slide" onRequestClose={() => setSelectedMeal(null)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedMeal?.type}</Text>
          {selectedMeal?.items.map((item: any, index: number) => (
            <Text key={index}>{`${item.name} - ${item.portion} (${item.category})`}</Text>
          ))}
          {selectedMeal?.notes ? <Text style={styles.notes}>Notes: {selectedMeal.notes}</Text> : null}
          <TouchableOpacity onPress={() => setSelectedMeal(null)}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  
  headerIcon: {
    padding: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  dateHeader: {
    backgroundColor: '#3498db',
    padding: 16,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  habitsContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  habitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  habitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  habitText: {
    fontSize: 16,
    color: '#34495e',
  },
  waterTrackerContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  waterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  waterAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
  },
  waterCupsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  waterCup: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterCupFilled: {
    backgroundColor: '#3498db',
  },
  waterTip: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  mealsContainer: {
    margin: 16,
  },
  mealsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addMealButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  mealCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mealType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  mealTime: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  mealCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  mealNotes: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  principlesContainer: {
    margin: 16,
    marginBottom: 24,
  },
  principlesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  principlesSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  principleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
  },
  principleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  principleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 8,
  },
  principleDescription: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
    marginBottom: 12,
  },
  tipContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  tipLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#34495e',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  mealTypeButton: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealTypeButtonActive: {
    backgroundColor: '#3498db',
  },
  mealTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  mealTypeTextActive: {
    color: 'white',
  },
  infoText: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
    marginBottom: 12,
  },
  infoTextBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34495e',
    marginVertical: 16,
    textAlign: 'center',
  },
  mealComponentsList: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  mealComponent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  componentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  componentText: {
    fontSize: 14,
    color: '#34495e',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
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
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '500',
  },
  notes: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
    minHeight: 100,
  },
  notesInput: {
    fontFamily: 'System',
    fontSize: 14,
    color: '#2c3e50',
    textAlignVertical: 'top',
  },
  
  notesLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
});

export default NutritionScreen;