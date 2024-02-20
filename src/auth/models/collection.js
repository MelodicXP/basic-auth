'use strict';

class Collection{
  constructor(model){
    this.model = model;
  }

  // ** CREATE - create item in database
  async create(json){
    try {
      const record = await this.model.create(json);
      return record;
    } catch(e){
      console.error('error in the collection interface');
      throw e;
    }
  }

  // ** READ - read items from data (serves for BOTH get all, and get by username)
  async read(username){
    try {
      // If no username is provided, fetch all records
      const options = username ? { where: { username: username } } : {};
      console.log('Option from Collection: ', options);
      const records = await this.model.findAll(options);
      
      // If username is provided, expecting a single record
      if (username && records.length) {
        return records[0]; // Since findByPk would return a single object, mimic that by returning the first item of the array.
      }

      return records; // Return all records if no username is provided, or an empty array if username provided doesn't exist

    } catch (e) {
      console.error('Read error in the collection interface:', e);
      throw e; 
    }
  }

  // ** READ / GET records by any foreign key (all books by author id)
  async readByForeignKey(foreignKey, value) {
    try {
      // Ensure authorId is provided
      if (!value) {
        throw new Error('A value for the foreign key is required');
      }

      // Fetch all records where the foreignKey matches the authorId
      const records = await this.model.findAll({ where: { [foreignKey]: value } });

      return records;
    } catch (e) {
      console.error(`Read by foreign key (${foreignKey}) error in the collection interface:`, e);
      throw e;
    }
  }

  // ** UPDATE - update record in database by id
  async update(id, json){
    try {
      // Find record by id
      const record = await this.model.findOne({ where: { id } });
      if (record) {
        // update record with json data passed in (req.body)
        await record.update(json);
        return record;
      }
      return null;
    } catch (e) {
      console.error('Update error in the collection interface:', e);
      throw e;
    }
  }

  // ** DELETE - delete record by id
  async delete(id){
    try {
      // Find record by id and delete
      const numDeleted = await this.model.destroy({ where: { id } });
      // return number of records deleted (should be 1 or 0 if no id found)
      return numDeleted;
    } catch (e) {
      console.error('Delete error in the collection interface:', e);
      throw e;
    }
  }
}

module.exports = Collection;