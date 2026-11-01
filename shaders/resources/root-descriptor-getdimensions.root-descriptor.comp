RWStructuredBuffer<uint> B : register(u0);

[numthreads(1, 1, 1)]
void main()
{
	uint count, stride;
	B.GetDimensions(count, stride);
	B[0] = count;
}
