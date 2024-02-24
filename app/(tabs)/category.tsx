import React, { useState, useEffect, FC } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView } from 'react-native';
import { db, IData } from '@/interfaces/calsses/DataBase';
import { SafeAreaView } from 'react-native-safe-area-context';
const category = () => {

  const [addCategory, SetAddCategory] = useState<IData[]>([]);
  const [Category, SetCategory] = useState<string>("");
  const fetchData = () => {
    db.fetchData('category', SetAddCategory);
  };
  const addTask = () => {
    if (Category != "") {
      db.addItem('category', { NameCat: Category.trim() }, fetchData);
      SetCategory("")
    } else {
      alert("Fill Category")
    }

  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, margin: 10 }}>
      {/* Form Add */}
      <View style={{
        flexDirection: 'row', justifyContent: "space-between", borderWidth: 1
      }}>
        <TextInput
          maxLength={20}
          style={{
            borderColor: "#333",

            flexBasis: "70%",
            paddingLeft: 10,
            paddingRight: 10
          }}
          value={Category}
          placeholder='food'
          onChangeText={(val) => SetCategory(val)} />
        <View style={{
          flexBasis: "30%",
          borderLeftWidth: 1,
          width: "100%",
          backgroundColor: "#333"


        }}>
          <Button

            onPress={addTask} title="Add Category" />
        </View>
      </View>

      {/* Form Add */}
      {/* Dispaly Data */}
      <View style={{ flex: 1, paddingTop: 20 }}>
        <View style={styles.table}>
          <View>
            <Text key="#category">#</Text>
          </View>
          <View>
            <Text key="#categoryName">Name</Text>
          </View>
          <View style={styles.textTable}>
            <Text key="#categoryAction">Action</Text>
          </View>


        </View>
        <ScrollView>

        
        {addCategory.map(task => (
          <View key={JSON.stringify(task)} style={styles.table}>
            <View style={styles.textTable}>
              <Text style={styles.textTable} key={task.ID}>{task.ID}</Text>
            </View>
            <View style={styles.textTable}>
              <Text key={task.NameCat}>{task.NameCat}</Text>
            </View>
            <View style={styles.textTable}>

              <Button title='Delete'
                onPress={() => {
                  db.deleteItem("category", { ID: task.ID }, fetchData)
                }}
              />


            </View>

          </View>
        ))}
        </ScrollView>
      </View>
      {/* End Display Data */}
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  table: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    padding: 15,
    alignItems: "center",
    alignContent: "flex-start"
  },
  textTable: {
    justifyContent: 'flex-start'
  }
})

export default category