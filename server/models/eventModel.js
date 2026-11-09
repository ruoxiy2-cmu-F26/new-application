const pool = require("./db");

// GET all events
//I/O operation: query the database to retrieve all events
async function getAllEvents() {
    const result = await pool.query(//await waits for the query to complete and returns a Promise that resolves to the result of the query
        `SELECT id, title,
                date::text AS date, 
                time::text AS time,
                description, organizer, invitees, done
         FROM public.events
         ORDER BY id ASC`
    );
    return result.rows;
}

// GET event by ID
async function getEventById(id) {
    const result = await pool.query(
        "SELECT id FROM public.events WHERE id = $1",
        //“$1” is a placeholder for the first parameter in the array that follows the query string. This helps prevent SQL injection attacks by separating the query structure from the data being inserted.
        //Parameterized Query
        [id]
    );
    return result.rows[0];
}

// CREATE event
async function createEvent(eventData) {
    const {
        title,
        date,
        time,
        description,
        organizer,
        invitees
    } = eventData;

    const result = await pool.query(
        `INSERT INTO public.events
         (title, date, time, description, organizer, invitees)
         VALUES ($1, $2, $3, $4, $5, $6::jsonb)
         RETURNING id, title,
                   date::text AS date,
                   time::text AS time,
                   description, organizer, invitees, done`,
        //jsonb：store JSON data in a binary format, allowing for efficient storage and querying of JSON data within the database.
        [
            title,
            date,
            time,
            description,
            organizer,
            JSON.stringify(invitees)//convert the invitees array to a JSON string before storing it in the database
        ]
    );
    return result.rows[0];
}

// UPDATE event done status
async function updateEvent(id, done) {
    const result = await pool.query(
        `UPDATE public.events
         SET done = $1
         WHERE id = $2
         RETURNING id, title,
                   date::text AS date,
                   time::text AS time,
                   description, organizer, invitees, done`,
        [done, id]
    );
    return result.rows[0];
}

// UPDATE invitee status
async function updateInviteeStatus(id, name, status) {
    const result = await pool.query(
        `UPDATE public.events
         SET invitees = jsonb_set(
             invitees,
             ARRAY[
                 (
                     SELECT (position - 1)::text
                     FROM jsonb_array_elements(invitees)
                          WITH ORDINALITY AS item(person, position)
                     WHERE person->>'name' = $2
                     LIMIT 1
                 ),
                 'status'
             ],
             to_jsonb($3::text),
             true
         )
         WHERE id = $1
           AND EXISTS (
               SELECT 1
               FROM jsonb_array_elements(invitees) AS person
               WHERE person->>'name' = $2
           )
         RETURNING id, title,
                   date::text AS date,
                   time::text AS time,
                   description, organizer, invitees, done`,
        [id, name, status]
    );
    return result.rows[0];
}

// DELETE event
async function deleteEvent(id) {
    const result = await pool.query(
        "DELETE FROM public.events WHERE id = $1",
        [id]
    );
    return result.rowCount > 0;
}

//export the functions to be used in other files(controller.js)
module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    updateInviteeStatus,
    deleteEvent
};