import { users } from '@/constants/Users';
import { IData, db } from '@/interfaces/calsses/DataBase';
import { str } from '@/interfaces/calsses/Storage';
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Button, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';


export default function ModalScreen() {


  const [selectedUser, setselectedUser] = useState("");
  const [t, SetT] = useState(false);
  const [opencard, SetPoenCard] = useState(0);
  const [ListSelcted, setListSelcted]: any = useState([]);
  const [perPerson, SetPerPerson]: any = useState();
  const [testNew, SettestNew] = useState<any[]>([]);
  const [SouAmount, SetSouAmount]: any = useState(0);

  const [cateList, SetCateList] = useState<IData[]>([]);
  const [subcateList, SetSubCateList] = useState<IData[]>([]);

  const [catSelect, SetCatSelect]:any = useState(0);
  const [SubCatSelect, SetSubCatSelect]:any = useState();


  const [Title, SetTitle]: any = useState();
  const [PayTransaction, SetPayTransaction]: any = useState()

  const [PayedBy, SetPayedBy]: any = useState();
  const [Amount, setAmount]: any = useState(0);

  useEffect(() => {
    
    SetSouAmount((Amount / (ListSelcted.length + 1)).toFixed(2))

    

  }, [ListSelcted])
  useEffect(() => {
    async function test() {
      await str.getTest("User", SetPayedBy, SetT,SetPayTransaction)
      // if(t===false && selectedUser=="") alert("pLease select user")
      console.log(selectedUser)

    }
    test();
    fetchData();

  }, [])
  const fetchExpense = () => {
    //db.fetchData("Expense", SetExpenseList);
  }

  const fetchData = () => {
    db.fetchData('category', SetCateList);
    db.fetchData('subCategory', SetSubCateList);

    console.log(cateList, subcateList)


    //db.fetchDataQuery("SELECT SUM(Amount) as expense FROM Expense",setTask)
  };
  const add = () => {

   

    let str: any = {
      "shared": ListSelcted,
      "Payed": testNew
    }

    const data = {
      Title: Title,
      PaymentTransaction: PayTransaction,
      PayedBy: PayedBy,
      Amount: Amount,
      Structure: JSON.stringify(str),
      IdSubCat: SubCatSelect
    }

    console.log(data)
   db.addItem('Expense', data, fetchExpense);
    SetTitle();
    setAmount(0)
    SetPayTransaction(PayedBy+new Date().getTime())
    SetSubCatSelect(0)
    SetCatSelect(0)
    setListSelcted([])


    //console.log(data)

    // Create user table

  }

  return (
    <View style={styles.container}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <Text style={styles.heading3}>Expense Transaction Serie: {PayTransaction} </Text>

      {/* Input field for expense name */}
      <Text style={styles.label}>Expense Name</Text>
      <TextInput
        onChangeText={(value) => SetTitle(value)}
        style={styles.textInput}
        placeholder="Enter the expense name"
        value={Title}
      />
      {/* Input field for expense Amount */}
      <Text style={styles.label}>Amount</Text>
      <TextInput
        keyboardType='numeric'
        onChangeText={(value) => {
          // Ensure only numeric values are entered for the Amount
         // const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));

          setAmount(value)
        }}
        value={Amount}
        style={styles.textInput}
        placeholder="[0-9]"
      />
      {/* Payed by */}
      <Text style={styles.label}>Pay By</Text>
      <View style={styles.radioGroup}>

        {
          users.map((user, index) => {
            return (

              <View key={JSON.stringify(user)} style={styles.radioButton}>
                <RadioButton.Android
                  value={user.Name}
                  status={(PayedBy === user.Name) ?
                    'checked' : 'unchecked'}
                  onPress={() => {
                    //alert(user.Name)
                    SetPayedBy(user.Name)
                  }
                  }
                  color="#007BFF"
                />

                <Text style={styles.radioLabel}>
                  {user.Name}
                </Text>
              </View>
            );
          })}


      </View>
      {/* userStructure */}
      {/* Add who shared payed */}
      <View style={styles.card}>
        {opencard != 2 && (
          <TouchableOpacity key={opencard} style={styles.cardPreview} onPress={() => SetPoenCard(2)}>

            <Text style={styles.previewText}>Select User</Text>
            <Text style={styles.previewdData}>{ListSelcted.length + 1}/{users.length}</Text>

          </TouchableOpacity>
        )}
        {opencard === 2 && (
          <>
            <TouchableOpacity style={styles.cardPreview} onPress={() => {
              SetPoenCard(0)
            }}>
              <Text style={styles.cardHeader}>User Selected : </Text>
            </TouchableOpacity>
            <View style={styles.cardBody}>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {users.filter((item, i) => item.Name != PayedBy).map((item, i) => (

                  <TouchableOpacity key={i} style={item.isChecked == true && styles.placeSelected} onPress={() => {
                    //user[ListSelcted].isChecked = !user[ListSelcted].isChecked;
                    if (ListSelcted.includes(item.ID) === false) {
                      //console.log("exlude", PayedBy.trim())

                      setListSelcted([...ListSelcted, item.ID])

                      let newT: any =
                      {
                        ID: item.ID,
                        Name: item.Name,
                        Payed: false
                      }


                      testNew.push(newT);

                    } else {
                      let clone: any[] = [...ListSelcted];
                      let index = clone.findIndex(i => i == item.ID);
                      let indexArr = testNew.findIndex(i => i.ID === item.ID)
                      clone.splice(index, 1);
                      testNew.splice(indexArr, 1)
                      setListSelcted([...clone])

                      // console.log(index, 'clone', clone);
                    }
                    
                    //console.log(ListSelcted,ListSelcted.length)                
                  }} >
                    <Text style={ListSelcted.includes(item.ID) == true ? styles.placeSelected : styles.place} >{item.Name}/{SouAmount}</Text>
                  </TouchableOpacity>
                ))}


              </ScrollView>

            </View>

          </>

        )}
      </View>




      {/* cate selected category  */}
      <Text style={styles.label}>Select Category: </Text>

      <Picker
        style={{ width: "100%" }}
        selectedValue={catSelect}
        onValueChange={(itemValue, itemIndex) => {
          SetCatSelect(itemValue)
        }}
      >
        <Picker.Item
          key={0}
          label="Choose Cat"
          value={0}
        />
        {cateList.map((cat, index) => {
          return (
            <Picker.Item
              key={cat.ID}
              label={cat.NameCat}
              value={cat.ID}
            />
          );
        })}
      </Picker>
      {/* Sub cate */}
      <Picker
        style={{ width: "100%" }}
        selectedValue={SubCatSelect}
        onValueChange={(itemValue, itemIndex) => {
          
          SetSubCatSelect(itemValue)
          //console.log(itemValue)
        }}
      >
        <Picker.Item
          key={0}
          label="Choose Sub Cat"
          value={0}
        />
        {subcateList.filter(cat => cat.catID === catSelect).map((cat, index) => {
          return (
            <Picker.Item
              key={cat.ID}
              label={cat.NameSubCat}
              value={cat.ID}
            
            />
          );
        })}
      </Picker>
      <View>
      <Button title="Add New Expense" onPress={
        ()=>{
          
        add();

        
        
        }
      }/>
      

      </View>
      <TouchableOpacity onPress={() => {
        //form.PayedBy='' &&   SetForm({ ...form, PayedBy: selectedUser })




      }}>
        <Text>Test</Text>
      </TouchableOpacity>





      {/* Use a light status bar on iOS to account for the black space above the modal */}
    </View>
  );
}

const styles = StyleSheet.create({
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
  placesContainer: {
    flexDirection: 'row',
    gap: 25,
  },
  place: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  placeSelected: {
    borderColor: "grey",
    borderWidth: 2,
    borderRadius: 10,
    width: 100,
    height: 100,
  },
  cardHeader: {
    fontSize: 24,
    padding: 20,
  },
  cardBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  previewText: {
    fontSize: 14,
    color: 'grey',
  },
  previewdData: {
    fontSize: 14,
    color: '#333',
  },

  card: {
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
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    bottom: 5,
    position: "absolute",
    width: "100%",
    height: 50,
    gap: 25,
    alignItems: "center",

  },
  container: {
    backgroundColor: "#fff",
    height: "100%",

  },
  heading: {
    color: "green",
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
  addButton: {
    padding: 10,
    margin: 10,
  },
  heading2: {
    color: "black",
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
  },
  heading3: {
    color: "black",
    fontSize: 20,
    textAlign: "center",
  },
  label: {
    color: "black",
    fontSize: 16,
    textAlign: "left",
    fontWeight: "bold",
    marginLeft: 10,
  },
  expenseTile: {
    // column with 3 cells
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "lightgrey",
    width: "95%",
    padding: 10,
    margin: 10,
  },
  expenseTileText: {
    fontSize: 20,
    width: "22%",
    textAlign: "center",
  },
  formAdd: {
    // display: "none",
  },
  textInput: {
    borderRadius: 12,
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    margin: 10,
  },
});
