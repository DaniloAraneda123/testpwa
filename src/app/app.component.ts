import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import PouchDB from 'pouchdb-browser'
import { interval, Subscription } from 'rxjs';
import { handleConnection } from './utils';
import { v4 as uuidv4 } from 'uuid';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	title = 'test-pwa';


	form = new FormGroup({
		filedata: new FormControl(undefined, [Validators.required]),
		title: new FormControl(undefined, [Validators.required]),
	})

	data: any;
	response: any;
	db: PouchDB.Database<{}>;
	subs: Subscription;

	constructor(private _http: HttpClient) {
		this.db = new PouchDB("files_db")
		window.addEventListener('online', handleConnection);
		window.addEventListener('offline', handleConnection);

		this.subs = interval(5000).subscribe(() => this.syncDB())
	}

	ngOnDestroy(): void {
		this.subs.unsubscribe()
	}

	ngOnInit(): void {
		this.form.enable()
		this._http.get("https://a2g-pwa.sa.ngrok.io/test_2").subscribe(el => {
			this.data = el
		})
	}


	async syncDB() {

		let data = await this.db.allDocs({
			include_docs: true,
			attachments: true
		})
		console.log(data)
	}


	onSubmit() {
		// let formData = new FormData();
		// formData.append("title",this.form.get('title')!.value)
		// formData.append("filedata",this.form.get('filedata')!.value)
		console.log(this.form.value)
		this._http.post("https://a2g-pwa.sa.ngrok.io/test_1", this.form.value).subscribe({
			next: (el) => {
				let id = uuidv4()
				this.db.put({_id:id,...this.form.value}).then(el=>{
					this.db.remove({_id:id,_rev:el.rev})
				})
				this.response = el
			},
			error: (el) => {
				console.log("Error en la DB")
				this.db.put({_id:uuidv4(),...this.form.value})
			}
		})
	}
}
