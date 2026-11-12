package com.rubyai.assistant.memory

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "ruby_contacts")
data class ContactEntity(
    @PrimaryKey val id: String,
    val name: String,
    val phoneNumber: String,
    val aliasesCsv: String,
    val isEmergency: Boolean = false,
    val bypassRiding: Boolean = false
)

@Dao
interface ContactDao {
    @Query("SELECT * FROM ruby_contacts")
    fun getAllContacts(): Flow<List<ContactEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertContact(contact: ContactEntity)

    @Delete
    suspend fun deleteContact(contact: ContactEntity)
}

@Database(entities = [ContactEntity::class], version = 1, exportSchema = false)
abstract class RubyDatabase : RoomDatabase() {
    abstract fun contactDao(): ContactDao
}
