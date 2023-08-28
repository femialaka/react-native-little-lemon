import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase('mydb.db');

const initializeTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      "create table if not exists menu_items (id integer primary key not null, name text, price text, description text, image text, category text);",
      [],
      () => {
        console.log('Table created successfully');
      },
      (_, error) => {
        console.error('Error creating table:', error);
      }
    );
  });
};

const insertData = jsonData => {
  jsonData.map(item => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO menu_items (id, name, price, description, image, category)
         VALUES (?,?, ?, ?, ?, ?);`,
        [item.id, item.name, item.price.toString(), item.description, item.image, item.category],
        () => {
          console.log('Data inserted successfully');
        },
        (_, error) => {
          console.error('Error inserting data:', error);
        }
      );
    });
  });
};

async function fetchMenuItems() {
  return new Promise(resolve => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM menu_items", [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}

  async function filterByQueryAndCategories(query = '', activeCategories) {
    //console.log(`Query: ${query}  activeCategories: ${activeCategories}`)
    return new Promise((resolve, reject) => {
        const categories = activeCategories
          .map((category) => `category = '${category}'`)
          .join(" or ");
  
        const categoryQuery = `${categories};`;
        db.transaction((tx) => {
          tx.executeSql(
            `select * from menu_items where (name like '%${query}%') and ${categoryQuery}`,
            [],
            (_, { rows }) => {
              resolve(rows._array);
            }
          );
        }, reject);
      
    });
  }

export { filterByQueryAndCategories, initializeTable, insertData, fetchMenuItems };
