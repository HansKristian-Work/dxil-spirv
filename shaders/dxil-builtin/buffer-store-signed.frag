RWBuffer<int2> RWBuf : register(u0);

void main(nointerpolation uint index : INDEX, nointerpolation int2 data : DATA)
{
	RWBuf[index] = data;
}
