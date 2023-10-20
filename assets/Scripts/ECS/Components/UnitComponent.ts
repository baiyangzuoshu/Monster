import { GameState } from "../../Enum";
import MonsterEntity from "../Entities/MonsterEntity";

export default class UnitComponent  {
    public angle:number=0;
    public state:GameState=GameState.None;
    public m_attackTarget:cc.Node=null;
    public attackEntity:MonsterEntity=null;
    public isDead:boolean=false;
    public fireTime:number=0;
}
