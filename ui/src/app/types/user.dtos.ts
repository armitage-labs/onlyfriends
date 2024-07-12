export interface CreateUserDto {
  providerId: string;
  fid: string;
  ownerAddress: string;
  bio?: string;
  profileUrl?: string;
  displayName?: string;
  username?: string;
}
