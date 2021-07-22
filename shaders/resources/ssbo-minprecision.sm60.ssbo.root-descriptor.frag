StructuredBuffer<min16float> B;
RWStructuredBuffer<min16float> C;

int main(min16int a : A) : SV_Target
{
	C[a] = B[a] + B[a + 1];
	return 10;
}
