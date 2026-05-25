'use strict';
const { universe, settlements } = require('./generate.json');
const fs = require('node:fs');
const path = require('node:path');

const star_systems = {
    star_array: [[], []],
    json(id) {
        return JSON.stringify(this.star_array[id]);
    },
    add(id, x, y) {
        let exists = false;
        this.star_array[id].forEach((star) => {
            if (exists == false && Number(star.x) == Number(x) && Number(star.y) == Number(y)) {
                star.r += 1;
                exists = true;
            }
        });
        if (exists == false) {
            this.star_array[id].push({
                x: Number(x),
                y: Number(y),
                r: 1
            });
        }
    }
}

fs.readdir(universe, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }
    files.forEach(file => {
        let pick;
        pick = /(\-?\d+)\_(\-?\d+)\_\-?\d+\_(\d+)\_?(\d+)?\.world(.*fail)?/.exec(file);
        if (pick !== null) {
            console.log(`${pick[0]} | ${pick[1]} | ${pick[2]} | ${pick[3]} | ${pick[4] ? pick[4] : "X"}${pick[5] ? " | C" : ""}`);
            if (pick[5]) {
                star_systems.add(0, pick[1], pick[2]);
            } else {
                star_systems.add(1, pick[1], pick[2]);
            }
        }
    });
    console.log(star_systems.star_array[1].length);
    console.log(star_systems.star_array[0].length);

    fs.readFile('template.htm', 'utf8', (err, template_file) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        let final = template_file.replace('STAR_DATE', Math.floor(Date.now() / 1000)).replace('STAR_BASE', JSON.stringify(settlements)).replace('STAR_BAD', star_systems.json(0)).replace('STAR_GOOD', star_systems.json(1));
        fs.writeFile('index.htm', final, (err) => { });
    });

});
