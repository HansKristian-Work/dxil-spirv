static const int2 values[8] = {
	int2(1, -1),
	int2(2, -2),
	int2(3, -3),
	int2(5, -5),
	int2(7, -7),
	int2(11, -11),
	int2(13, -13),
	int2(17, -17)
};

uint2 main(nointerpolation uint index : TEXCOORD) : SV_Target
{
	return values[index];
}
