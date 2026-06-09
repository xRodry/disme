/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Token } from "./shared/rest-api/token";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent {
    title = "disme-front-end";

    constructor(public translate: TranslateService) {
        translate.addLangs(["en", "pt"]);
        translate.setDefaultLang("en");
        translate.use(Token.getTokenLanguage());
    }
}
