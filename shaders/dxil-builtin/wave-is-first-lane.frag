RWByteAddressBuffer Buf : register(u0);

void main(uint thr : THR)
{
	if (thr == 40)
		discard;

	if (WaveIsFirstLane())
		Buf.Store(0, 1);
	else
		Buf.Store(0, 0);
}
