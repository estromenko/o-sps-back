import pool from "../database/database";


const getInvitationById = async (id: number) => {
    if (id === undefined) {
        return null;
    }
    const invitation = await pool.query(`SELECT * FROM invitations WHERE id=${id}`);
    if (invitation.rowCount == 0) {
        return null
    }

    return invitation.rows[0];
};

export {
    getInvitationById,
};