import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, Platform, StatusBar, NativeModules, VirtualizedList } from 'react-native';
import { db, IData } from '@/interfaces/calsses/DataBase'; // Assuming this import is correct
import { Calculate, str } from '@/interfaces/calsses/Storage';

import { useLocalSearchParams } from 'expo-router';
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
      <View
        key={JSON.stringify(item)}
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





  useEffect(() => {
    toggleDetails();



  }, [data]);

  const toggleDetails = async () => {
    let query: string = "";
    switch (params?.name) {
      case "debt":
        query = `SELECT *,strftime('%Y-%m-%d', DateExpense) as 'date'
        FROM Expense  WHERE strftime('%m', DateExpense) = strftime('%m', datetime('now','localtime'))
        GROUP BY  DateExpense
        ORDER BY  DateExpense DESC`
        break;
      case "credit":
        break;
      default:
        query = `SELECT *,strftime('%Y-%m-%d', DateExpense) as 'date'
        FROM Expense  WHERE strftime('%m', DateExpense) = strftime('%m', datetime('now','localtime'))
        AND
        PayedBy !="${selectedUser}"
        GROUP BY  DateExpense
        ORDER BY  DateExpense DESC`
    }


    let req = params?.name == undefined ? `SELECT *,strftime('%Y-%m-%d', DateExpense) as 'date'
    FROM Expense  WHERE strftime('%m', DateExpense) = strftime('%m', datetime('now','localtime'))
    GROUP BY  DateExpense
    ORDER BY  DateExpense DESC` : `SELECT *,strftime('%Y-%m-%d', DateExpense) as 'date'
    FROM Expense  WHERE strftime('%m', DateExpense) = strftime('%m', datetime('now','localtime'))
	AND
		PayedBy !="${selectedUser}"
    GROUP BY  DateExpense
    ORDER BY  DateExpense DESC`
    db.fetchDataQuery(req, setData);
    setDt(coupage(data, "date"));
    await str.getTest('User', setselectedUser, setT)


    //setDt(coupage(data, "date"));
    //Calculate()
    str.CalculateExpense(selectedUser, data, SetCalculate)

    setDebtsAmount(calculate?.Debt)
    setExpenseAmount(calculate?.Expense)
    setCreditAmount(calculate?.Credit)
    console.log("from Storage ", calculate)

  };

  return (
    <View style={{flex:1, paddingTop: Platform.OS ? StatusBarManager.HEIGHT : StatusBar.currentHeight }}>
      <View>
        <Text>{selectedUser} Expense: {ExpenseAmount} || Debt Amount : {DebtAmount} Craedit: {CreditAmount}</Text>
        {dt.map((item, index) => {
          const expensebydate: Calculate = str.CalculateExpense(selectedUser, item.data)
          return (
            <View key={item.date}>
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
    </View>
  );
}
