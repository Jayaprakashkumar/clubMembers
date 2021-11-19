export interface Clubs {
    club_members:{
        [key:string] : ClubMembers
    },
    club_name:string;
    club_address:string;

}

export interface ClubMembers {
    name: string;
    age: number;
}
