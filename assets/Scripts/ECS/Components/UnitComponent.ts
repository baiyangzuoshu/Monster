import { UnitState } from "../../Enum";
import MonsterEntity from "../Entities/MonsterEntity";

export default class UnitComponent  {
    public angle:number=0;
    public m_attackTarget:cc.Node=null;
    public attackEntity:MonsterEntity=null;
    public isDead:boolean=false;
    public fireTime:number=0;
    public state:UnitState=UnitState.None;
}
