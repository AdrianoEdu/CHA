// Copyright (c) 2026-20-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

type TextData = {
    title: string;
    description: string;
}

export type HeaderStatementProps = {
    headerTitle: string;
    balanceData: number;
    buttonTitle: string;
    onClick: () => void;
    primaryData: TextData;
    secondData?: TextData;
}
