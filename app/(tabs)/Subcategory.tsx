import React, { useState, useEffect, FC } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView } from 'react-native';
import { db, IData } from '@/interfaces/calsses/DataBase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
const Subcategory = () => {

    const [addSubCategory, SetAddSubCategory] = useState<IData[]>([]);
    const [addCategory, SetAddCategory] = useState<IData[]>([]);
    const [subCategory, SetSubCategory] = useState<string>('');

    const [Category, SetCategory] = useState<number>(0);
    const fetchData = () => {
        db.fetchData('category', SetAddCategory);
        db.fetchDataQuery(`SELECT subCategory.ID as ID,NameSubCat,NameCat FROM subCategory,category where subCategory.catID= category.ID`, SetAddSubCategory)

    };
    const addTask = () => {
        if (Category != 0 && subCategory != "") {
            db.addItem('subCategory', { NameSubCat: subCategory.trim(), catID: Category }, fetchData);

            SetCategory(0);
            SetSubCategory('')
        } else {
            alert("Fill Sub Category")
        }

    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <SafeAreaView style={{ flex: 1, margin: 10 }}>
            {/* Select Category */}
            <Text>Choose Category:</Text>

            <Picker
                style={{ width: "100%" }}
                selectedValue={Category}
                onValueChange={(itemValue, itemIndex) => {
                    SetCategory(itemValue)
                }}
            >
                <Picker.Item
                    key={0}
                    label="Choose Cat"
                    value={0}
                />
                {addCategory.map((user, index) => {
                    return (
                        <Picker.Item
                            key={user.ID}
                            label={user.NameCat}
                            value={user.ID}
                        />
                    );
                })}
            </Picker>
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
                    value={subCategory}
                    placeholder='food'
                    onChangeText={(val) => SetSubCategory(val)} />
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
                    <View>
                        <Text key="#categoryName">Cat</Text>
                    </View>
                    <View style={styles.textTable}>
                        <Text key="#categoryAction">Action</Text>
                    </View>


                </View>
                <ScrollView>
                    {addSubCategory.map(task => (
                        <View key={JSON.stringify(task)} style={styles.table}>
                            <View style={styles.textTable}>
                                <Text style={styles.textTable} key={task.ID}>{task.ID}</Text>
                            </View>
                            <View style={styles.textTable}>
                                <Text key={task.NameSubCat}>{task.NameSubCat}</Text>
                            </View>
                            <View>
                                <Text key="#categoryName">{task.NameCat}</Text>
                            </View>
                            <View style={styles.textTable}>
                                <Button title='Delete'
                                    onPress={() => {
                                        db.deleteItem("subCategory", { ID: task.ID }, fetchData)
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

export default Subcategory