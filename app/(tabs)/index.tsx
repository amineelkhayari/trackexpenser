import CustomListItem from '@/components/customListing';
import { users } from '@/constants/Users';
import { IData, db } from '@/interfaces/calsses/DataBase';
import { Calculate, str } from '@/interfaces/calsses/Storage';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function TabOneScreen() {
  const [selectedUser, setselectedUser] = useState("0");
  const [t, SetT] = useState(false);
  const [settest, setert] = useState(() => {
    async function test() {
      await str.getTest("User", setselectedUser, SetT)
    }
    test();
    fetchExpense
  })
  const [Expensed, SetExpensed]: any = useState(0.0);
  const [Credit, SetCredit]: any = useState(0.0);
  const [debt, Setdebt]: any = useState(0.0);
  const [calculate, SetCalculate] = useState<Calculate>();
  const [ExpenseList, SetExpenseList] = useState<IData[]>([]);




  const fetchExpense = () => {
    db.fetchDataQuery(`
  SELECT * from Expense, subCategory, category
  WHERE Expense.IdSubCat=subCategory.ID AND subCategory.catID=category.ID
  AND strftime('%m', DateExpense) =  strftime('%m', datetime('now','localtime'))
  order by DateExpense DESC
  `, SetExpenseList);
    str.CalculateExpense(selectedUser, ExpenseList, SetCalculate)
    SetExpensed(calculate?.Expense)
    Setdebt(calculate?.Debt)
    SetCredit(calculate?.Credit);
  }
  useEffect(() => {
    fetchExpense()
  }, [])
  return (
    <SafeAreaView style={styles.container}>
      {
        (t === false) ? (
          <View style={styles.radioGroup}>

            {
              users.map((user, index) => {
                return (

                  <View key={JSON.stringify(user)} style={styles.radioButton}>
                    <RadioButton.Android
                      value={user.Name}
                      status={selectedUser == user.Name ?
                        'checked' : 'unchecked'}
                      onPress={() => setselectedUser(user.Name)}
                      color="#007BFF"
                    />

                    <Text style={styles.radioLabel}>
                      {user.Name}
                    </Text>
                  </View>
                );
              })}
            <TouchableOpacity key="StoreData" style={styles.textInput} onPress={() => {
              if (selectedUser != '0') {
                SetT(true)
                str.storeData('User', selectedUser);

              }
              else {

                alert("Please Select user ")
              }
            }}>
              <Text style={{ textAlign: 'center' }}>Select User</Text></TouchableOpacity>

          </View>

        ) : (


          <View style={{ width: "100%" }}>
            <Button title="refresh" onPress={() => fetchExpense()} />
            {/* Start Header  */}
            <View style={styles.fullName}>
              <Avatar.Image size={60} source={require('@/assets/images/icon.png')} />
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Welcome Mrs :</Text>
                <Text style={{ color: '#4A2D5D', fontSize: 20 }}>
                  {selectedUser}
                </Text>
              </View>
            </View>
            {/* end Header */}
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
                    $ {Expensed}
                  </Text>
                </View>

              </TouchableOpacity>

              <View style={styles.cardBottom}>

                <TouchableOpacity onPress={() => ""}>
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
                      $ {Credit}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={()=>{
                  router.push(
                    {
                      pathname:'/Transaction',params:{name:'debts'}
                    }
                  )
                }}
                >
                  <View>
                    <View style={styles.cardBottomSame}>
                      <Feather name='arrow-up' size={18} color='red' />
                      <Text style={{ textAlign: 'center', marginLeft: 5 }}>
                        Debts
                      </Text>
                    </View>
                    <Text style={{ textAlign: 'center' }}>
                      $ {debt}
                    </Text>
                  </View>
                </TouchableOpacity>

              </View>
            </View>
            {/*  */}
          </View>
        )
      }
        {/* Start for Recent Transaction */}

        <View style={styles.recentTitle}>
              <Text style={{ color: '#4A2D5D' }}>
                Recent Transactions
              </Text>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() =>   router.push({
                  pathname: `/Transaction`,
                })}
              >
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, flexDirection: "row", height: "auto" }}>
              <CustomListItem
                expenseList={ExpenseList}
                userLocal={selectedUser}

              />
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
