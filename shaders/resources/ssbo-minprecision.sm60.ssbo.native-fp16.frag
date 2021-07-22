StructuredBuffer<min16float> B;
RWStructuredBuffer<min16float> C;

StructuredBuffer<min16int> Bint;
RWStructuredBuffer<min16int> Cint;

int main(min16int a : A) : SV_Target
{
	C[a] = B[a] + B[a + 1];
	Cint[a] = Bint[a] + Bint[a + 1];
	return 10;
}
