resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.idp.id

  tags = {
    Name = "idp-igw"
  }
}