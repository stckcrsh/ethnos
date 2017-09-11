import { Player } from "../../models/player.model";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-player-create-form",
  templateUrl: "./player-create-form.component.html",
  styleUrls: ["./player-create-form.component.css"]
})
export class PlayerCreateFormComponent implements OnInit {
  public setupForm: FormGroup;

  @Output() public newPlayer: EventEmitter<Player> = new EventEmitter<Player>();

  constructor(private fb: FormBuilder) {
    this.setupForm = this.fb.group({
      name: ""
    });
  }

  ngOnInit() {}

  public onSubmit() {
    this.newPlayer.next(this.setupForm.value);
  }
}
