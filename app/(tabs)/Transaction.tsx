import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform, StatusBar, NativeModules, VirtualizedList, SafeAreaView, Button } from 'react-native';
import { db, IData } from '@/interfaces/calsses/DataBase'; // Assuming this import is correct
import { Calculate, str } from '@/interfaces/calsses/Storage';

import { router, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';
import { base64 } from '@/interfaces/helper';
const { StatusBarManager } = NativeModules;

// Sample sales data


const coupage = (data: any[], groupeBy: string) => {
  const uniqueDates = [...new Set(data.map(item => item[groupeBy]))];
  // Prepare data for FlatList
  const groupedData = uniqueDates.map(date => ({
    date,
    data: data.filter(item => item[groupeBy] === date)
  }));
  return groupedData;
}

export default function App() {
  // Function to render sales data details
  const renderItem = ({ item }: { item: any }) => {
    let users: any = JSON.parse(item.Structure).Payed;
    let lengthUser: number = users.length;
    return (
      <View key={JSON.stringify(item)}
      style={{

        marginLeft: 20, backgroundColor: item.PayedBy != selectedUser ? '#f1f1f1' : '#f5f5f5',
        borderRadius: 14,
        margin: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: {
          width: 2,
          height: 2,
        },
        gap: 20,
        padding: 10
      }}>
        <TouchableOpacity
        onPress={()=>
        {
          router.push({
            pathname: `/detail/detailPage`, params: { id: base64.atob(JSON.stringify(item)), user: selectedUser }
          });
    
        }}
        >
        <View style={{}}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text> Title        : {`${item.Title}`}</Text>
            <Text> Totale Price : ${(item.Amount).toFixed(2)}</Text>

          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

            <Text> Payed By: {item.PayedBy} </Text>
            <Text>Users Lenght: {lengthUser + 1}</Text>
          </View>
        </View>

        <View style={{
          flexDirection: 'row', justifyContent: "space-evenly",

          backgroundColor: '#fff',
          borderRadius: 14,
          margin: 10,
          elevation: 4,
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowRadius: 4,
          shadowOffset: {
            width: 2,
            height: 2,
          },
          gap: 20,
          padding: 10

        }}>
          {lengthUser > 0 &&
            users.map((it: any) => {
              if (it.Name === selectedUser)
                return <View key={JSON.stringify(it)} style={{ alignItems: "center" }}>
                  <Text style={{ color: it.Payed ? "green" : "red" }}>{it.Name}</Text>
                  <Text>{item.Amount / (lengthUser + 1)}</Text>

                </View>
              if (item.PayedBy === selectedUser)
                return <View key={JSON.stringify(it)} style={{ alignItems: "center" }}>
                  <Text style={{ color: it.Payed ? "green" : "red" }}>{it.Name}</Text>
                  <Text>{item.Amount / (lengthUser + 1)}</Text>
                </View>
            })
          }
        </View>

      </TouchableOpacity>
      </View>
    );
  }

  const [dt, setDt] = useState<any[]>([]);
  const [data, setData] = useState<IData[]>([]);
  const [selectedUser, setselectedUser] = useState<string>("");


  const [ExpenseAmount, setExpenseAmount]: any = useState();
  const [CreditAmount, setCreditAmount] = useState<any>();
  const [DebtAmount, setDebtsAmount] = useState<any>();
  const [calculate, SetCalculate] = useState<Calculate>();
  const params = useLocalSearchParams();
  const [t, setT]: any = useState(false);
const [pr, SetParams]: any = useState(params.name);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const [month, setMonth]: any = useState(new Date().toLocaleDateString('default', { month: 'numeric' }));
  const[daySelect,SetdaySelected] = useState(new Date().getDate());
  const [day, setDay]: any = useState(new Date(new Date().getFullYear(), month, 0).getDate()
  )


  useEffect(() => {
    toggleDetails(pr);



  }, [data]);

  const toggleDetails = async (filter?:string) => {
    let query: string = "";
    //console.log("sss",filter)
    switch (filter) {
      case "month":
        query = `SELECT *,strftime('%Y-%m-%d', DateExpense) as 'date'
        FROM Expense, subCategory, category 
         WHERE 
         Expense.IdSubCat=subCategory.ID AND subCategory.catID=category.ID AND
         strftime('%m', DateExpense) = '${month <10 ? '0'+month:month}'
        GROUP BY  DateExpense
        ORDER BY  DateExpense DESC`;
        break;
        case "day":
          query = `SELECT *,strftime('%Y-%m-%d', DateExpense) as 'date'
          FROM Expense, subCategory, category 
           WHERE 
           Expense.IdSubCat=subCategory.ID AND subCategory.catID=category.ID AND

           strftime('%m', DateExpense) = '${month <10 ? '0'+month:month}'
          AND strftime('%d', DateExpense) = '${daySelect <10 ? '0'+daySelect:daySelect}'
          GROUP BY  DateExpense
          ORDER BY  DateExpense DESC`;

          break;
      case "debts":
        query = `SELECT *,strftime('%Y-%m-%d', DateExpense) as 'date'
        FROM Expense, subCategory, category 
        WHERE 
        Expense.IdSubCat=subCategory.ID AND subCategory.catID=category.ID AND strftime('%m', DateExpense) = strftime('%m', datetime('now','localtime'))
        AND
        PayedBy !="${selectedUser}"
        GROUP BY  DateExpense
        ORDER BY  DateExpense DESC`
        break;
      
      default:
        query = `SELECT *,strftime('%Y-%m-%d', DateExpense) as 'date'
        FROM Expense, subCategory, category 
        WHERE 
        Expense.IdSubCat=subCategory.ID AND subCategory.catID=category.ID AND strftime('%m', DateExpense) = strftime('%m', datetime('now','localtime'))
        GROUP BY  DateExpense
        ORDER BY  DateExpense DESC`
        
        break;
    }


     
    db.fetchDataQuery(query, setData);
    setDt(coupage(data, "date"));
    await str.getTest('User', setselectedUser, setT)


    //setDt(coupage(data, "date"));
    //Calculate()
    str.CalculateExpense(selectedUser, data, SetCalculate)

    setDebtsAmount(calculate?.Debt)
    setExpenseAmount(calculate?.Expense)
    setCreditAmount(calculate?.Credit)

  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS ? StatusBarManager.HEIGHT : StatusBar.currentHeight }}>
      {/*  */}
      <View style={styles.card}>
              <View style={styles.cardBottom}>

              </View>


              <TouchableOpacity onPress={() => {


              }} >
                <View style={styles.cardTop}>

                  <Text style={{ textAlign: 'center', color: 'aliceblue', flexDirection: "row", justifyContent: "space-between" }}>
                    Total Expense

                  </Text>
                  <Text style={{ fontSize: 20, textAlign: 'center', color: 'aliceblue' }}>
                    $ {ExpenseAmount}
                  </Text>
                </View>

              </TouchableOpacity>

              <View style={styles.cardBottom}>

                  <View>
                    <View style={styles.cardBottomSame}>
                      <Feather name='arrow-down' size={18} color='green' />
                      <Text
                        style={{
                          textAlign: 'center',
                          marginLeft: 5,
                        }}
                      >
                        Credits
                      </Text>
                    </View>
                    <Text style={{ textAlign: 'center' }}>
                      $ {CreditAmount}
                    </Text>
                  </View>
               
                  <View>
                    <View style={styles.cardBottomSame}>
                      <Feather name='arrow-up' size={18} color='red' />
                      <Text style={{ textAlign: 'center', marginLeft: 5 }}>
                        Debts
                      </Text>
                    </View>
                    <Text style={{ textAlign: 'center' }}>
                      $ {DebtAmount}
                    </Text>
                  </View>
                

              </View>
            </View>
            {/*  */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ flexBasis: '50%' }} >

        <Picker 
          selectedValue={month}
          onValueChange={(value, index) => {
            setMonth(value)
            setDay(new Date(new Date().getFullYear(), value, 0).getDate())
          }}
        >
          {
            monthNames.map((item, index) => {

              return (
                <Picker.Item
                  key={item}
                  label={item}
                  value={"" + (index + 1)}
                />
              )
            })

          }

        </Picker>
        <Button title="Filter Month"
          onPress={()=>{
           
            SetParams('month')
            toggleDetails()
          }}
        />
        </View>
       <View style={{ flexBasis: '50%' }} >
       <Picker
        selectedValue={daySelect}
        onValueChange={
          (item,index)=>{
            SetdaySelected(item)
          }
        }
        >
          {
            Array.from(Array(day).keys()).map(item => {
              return (
                <Picker.Item
                  key={month+item}
                  label={"" + (item + 1)}
                  value={item + 1}
                />
              )

            })
          }
          
        </Picker>
        <Button title="Filter Day" onPress={()=>{
           SetParams('day')
            toggleDetails()
          }} />
       </View>
     
      </View>
      <Button title="Show Debts"
          onPress={()=>{
            
            SetParams('debts')
            toggleDetails()
          }}
        />
      <View style={{ flex: 1 }}>
        
        {dt.map((item, index) => {
          const expensebydate: Calculate = str.CalculateExpense(selectedUser, item.data)
          return (
            <View style={{ flex: 1 }} key={item.date} >
              <View style={{ backgroundColor: '#ccc', padding: 10, flexDirection: 'row', justifyContent: 'space-around' }}>
                <Text>{item.date}</Text>
                <Text>Expense: ${expensebydate.Expense} | Credit: ${expensebydate.Credit}| Debt: ${expensebydate.Debt}</Text>
              </View>
              <FlatList
                contentContainerStyle={{ flexGrow: 1 }} // Ensure proper scrolling behavior

                data={item.data}
                renderItem={renderItem}
                keyExtractor={(item) => JSON.stringify(item)} // Ensure each child has a unique key
              />
            </View>
          )
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

  radioGroup: {
    width: '100%',
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    gap: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    bottom: 5,
    flexWrap: 'wrap',
    padding: 10,



  },
  radioButton: {
    textAlign: "center",
    alignItems: "center"

  },
  radioLabel: {
    textAlign: 'left'
  },
  textInput: {
    borderRadius: 12,
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    width: "100%"
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 10,

  },
  fullName: {
    flexDirection: 'row',
  },
  card: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#535F93',

    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginVertical: 20,
  },
  cardTop: {
    // backgroundColor: 'blue',
    marginBottom: 20,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    margin: 'auto',
    backgroundColor: '#E0D1EA',
    borderRadius: 5,
  },
  cardBottomSame: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  recentTransactions: {
    backgroundColor: 'white',
    width: '100%',
  },
  seeAll: {
    fontWeight: 'bold',
    color: 'green',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  plusButton: {
    backgroundColor: '#535F93',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  containerNull: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },

});