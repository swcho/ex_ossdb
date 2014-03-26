/**
 * Created by sungwoo on 14. 3. 26.
 */

import ossdb = require('../models/ossdb');

export function get_oss(req, res) {
    ossdb.Oss.all((err, data) => {
        console.log(data);
        res.json(data);
    });
};