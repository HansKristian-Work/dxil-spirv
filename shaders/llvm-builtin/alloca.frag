uint main(nointerpolation uint index : TEXCOORD) : SV_Target
{
	uint array[4] = { 1, 2, 3, 4 };
	array[index & 3] = index;
	return array[0] + array[1] + array[2] + array[3];
}
