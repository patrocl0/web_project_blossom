export interface Filters {
  name?: string;
  character?: "All" | "Starred" | "Others";
  species?: "All" | "Human" | "Alien";
  status?: "All" | "Alive" | "Dead";
  gender?: "All" | "Male" | "Female";
}
