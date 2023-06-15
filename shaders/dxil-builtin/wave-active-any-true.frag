RWByteAddressBuffer Buf : register(u0);

void main(uint index : INDEX)
{
	if (index == 40)
		discard;

	bool any_true = WaveActiveAnyTrue(index < 100);
	if (any_true)
		Buf.Store(index * 4, 1);
}
