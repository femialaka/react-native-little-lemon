import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase('mydb.db'); // Replace 'mydb.db' with your desired database name

const initializeTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS menu_items
      (id INTEGER PRIMARY KEY AUTOINCREMENT,
       name TEXT,
       price TEXT,
       description TEXT,
       image TEXT,
       category TEXT);`,
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
        `INSERT INTO menu_items (name, price, description, image, category)
         VALUES (?, ?, ?, ?, ?);`,
        [item.name, item.price.toString(), item.description, item.image, item.category],
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

  const fetchMenuItems = (callback) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM menu_items',
        [],
        (_, { rows }) => {
          const data = rows._array;
          callback(data);
        },
        error => {
          console.error('Error fetching menu items:', error);
        }
      );
    });
  };

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
