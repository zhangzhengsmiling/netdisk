
import fs from 'fs';
import path from 'path';

const nameResolve = (prefix: string) => (name: string) => `${prefix}/${name}.json`;
const databaseNameResolve = nameResolve(path.resolve(__dirname, './data'));

const id = (name: string) => {
  new Database<{ key: string; id: number }>('id');
  const idItems = JSON.parse(fs.readFileSync(databaseNameResolve('id')).toString());
  const idItem = idItems.find(item => item.key === name);
  if (!idItem) {
    idItems.push({ key: name, id: 1 });
    fs.writeFileSync(databaseNameResolve('id'), JSON.stringify(idItems));
    return 1;
  } else {
    idItem.id++;
    fs.writeFileSync(databaseNameResolve('id'), JSON.stringify(idItems));
    return idItem.id;
  }
}

class Database<ADT> {
  private name: string;
  constructor(name: string) {
    console.log('数据库连接成功');
    this.name = name;
    this.load();
  }

  private load() {
    const path = databaseNameResolve(this.name);
    if (!fs.existsSync(path)) fs.writeFileSync(path, '[]');
  }

  public read(): ADT[] {
    const path = databaseNameResolve(this.name);
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  }

  public add(data: ADT) {
    const path = databaseNameResolve(this.name);
    const db = this.read();
    const item = {
      ...data,
      id: id(this.name),
      gmt_created: Date.now().valueOf()
    }
    db.push(item);
    fs.writeFileSync(path, JSON.stringify(db));
    return item
  }

  public updateById(id: number, data: ADT) {
    const path = databaseNameResolve(this.name);
    const db = this.read();
    const index = db.findIndex((item: any) => item.id === id);
    if (index === -1) return false;
    db[index] = {
      ...db[index],
      ...data,
      gmt_modified: Date.now().valueOf()
    };
    fs.writeFileSync(path, JSON.stringify(db));
    return true;
  }

  public deleteById(id: number) {
    const path = databaseNameResolve(this.name);
    const db = this.read();
    const index = db.findIndex((item: any) => item.id === id);
    if (index === -1) return false;
    db.splice(index, 1);
    fs.writeFileSync(path, JSON.stringify(db));
    return true;
  }

}

export default Database;
